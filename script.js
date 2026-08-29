const OFFERS = [
  { label: "Good Offer", discount: 10 },
  { label: "OK Offer", discount: 15 },
  { label: "Lowball Offer", discount: 20 },
  { label: "Super Lowball Offer", discount: 25 },
  { label: "Troll Offer", discount: 30 },
  { label: "Late Night Facebook Offer", discount: 60 },
];

const form = document.querySelector("#offer-form");
const valueInput = document.querySelector("#car-value");
const salvageTitleInput = document.querySelector("#salvage-title");
const checkerForm = document.querySelector("#checker-form");
const checkerCarValueInput = document.querySelector("#checker-car-value");
const checkerOfferValueInput = document.querySelector("#checker-offer-value");
const checkerSalvageTitleInput = document.querySelector("#checker-salvage-title");
const results = document.querySelector("#results");
const resultsValue = document.querySelector("#results-value");
const salvageValueBlock = document.querySelector("#salvage-value-block");
const salvageResultsValue = document.querySelector("#salvage-results-value");
const offerList = document.querySelector("#offer-list");
const insight = document.querySelector("#insight");
const checkerResults = document.querySelector("#checker-results");
const checkerEffectiveValue = document.querySelector("#checker-effective-value");
const checkerOfferDisplay = document.querySelector("#checker-offer-display");
const checkerSummaryLabel = document.querySelector("#checker-summary-label");
const checkerTier = document.querySelector("#checker-tier");
const checkerVerdict = document.querySelector("#checker-verdict");
const checkerContext = document.querySelector("#checker-context");
const messageModal = document.querySelector("#message-modal");
const messageOfferLabel = document.querySelector("#message-offer-label");
const messageText = document.querySelector("#message-text");
const copyMessageButton = document.querySelector("#copy-message");
const closeModalButton = document.querySelector("#close-modal");

const SALVAGE_DISCOUNT = 0.4;

const getEffectiveValue = (carValue, hasSalvageTitle) =>
  hasSalvageTitle ? carValue * (1 - SALVAGE_DISCOUNT) : carValue;

const getOfferTier = (percentageOff) => {
  if (percentageOff <= 10) {
    return { label: "Good Offer", lowball: false };
  }
  if (percentageOff <= 15) {
    return { label: "OK Offer", lowball: false };
  }
  if (percentageOff <= 20) {
    return { label: "Lowball Offer", lowball: true };
  }
  if (percentageOff <= 25) {
    return { label: "Super Lowball Offer", lowball: true };
  }
  if (percentageOff <= 30) {
    return { label: "Troll Offer", lowball: true };
  }

  return { label: "Late Night Facebook Offer", lowball: true };
};

const getDraftMessage = ({ label, offerPrice, hasSalvageTitle }) => {
  const titleNote = hasSalvageTitle
    ? " I know it has a salvage/rebuilt title, so I priced that in."
    : "";
  const formattedPrice = formatCurrency(offerPrice);

  const templates = {
    "Good Offer": `Hi, I’m interested in your vehicle. Based on the value and current market, I’d like to offer ${formattedPrice}.${titleNote} If that works for you, I’d be glad to set up a time to come see it.`,
    "OK Offer": `Hey, I took a look at the numbers and I’d be at ${formattedPrice}.${titleNote} Let me know if that’s in the ballpark and we can talk.`,
    "Lowball Offer": `Hey, I’d be around ${formattedPrice} on it.${titleNote} If you want to move it quickly, I can make that happen.`,
    "Super Lowball Offer": `Alright, here’s my slightly disrespectful but still real number: ${formattedPrice}.${titleNote} If you’re tired of looking at it, I can come get it.`,
    "Troll Offer": `I’ll save both of us some time: ${formattedPrice}.${titleNote} If that sounds offensive, that probably means we’re accurately measuring the gap here.`,
    "Late Night Facebook Offer": `Best I can do is ${formattedPrice}.${titleNote} Cash, minimal conversation, and I promise to act like I’m doing you a favor the entire time.`,
  };

  return templates[label];
};

const openMessageModal = ({ label, offerPrice, hasSalvageTitle }) => {
  messageOfferLabel.textContent = `${label} message draft`;
  messageText.value = getDraftMessage({ label, offerPrice, hasSalvageTitle });
  messageModal.showModal();
};

copyMessageButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(messageText.value);
  copyMessageButton.textContent = "Copied";
  window.setTimeout(() => {
    copyMessageButton.textContent = "Copy message";
  }, 1500);
});

closeModalButton.addEventListener("click", () => {
  messageModal.close();
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const carValue = Number(valueInput.value);
  const hasSalvageTitle = salvageTitleInput.checked;

  if (!Number.isFinite(carValue) || carValue <= 0) {
    valueInput.focus();
    return;
  }

  resultsValue.textContent = formatCurrency(carValue);
  salvageResultsValue.textContent = formatCurrency(getEffectiveValue(carValue, true));
  salvageValueBlock.hidden = !hasSalvageTitle;
  offerList.innerHTML = "";

  OFFERS.forEach((offer) => {
    const offerPrice = carValue * (1 - offer.discount / 100);
    const salvagePrice = offerPrice * (1 - SALVAGE_DISCOUNT);
    const card = document.createElement("article");
    card.className = "offer-card";
    card.innerHTML = `
      <div class="offer-main">
        <p class="offer-name">${offer.label}</p>
        <p class="offer-cut">${offer.discount}% off market value</p>
      </div>
      <div class="offer-side">
        <div class="offer-price">
          ${
            hasSalvageTitle
              ? `
                <span class="offer-price-original">${formatCurrency(offerPrice)}</span>
                <span class="offer-price-adjusted">${formatCurrency(salvagePrice)}</span>
                <span class="offer-disclaimer">Salvage/rebuilt title adjustment: 40% off</span>
              `
              : formatCurrency(offerPrice)
          }
        </div>
        <div class="offer-actions">
          <button
            class="offer-message-button"
            type="button"
            data-offer-label="${offer.label}"
            data-offer-price="${hasSalvageTitle ? salvagePrice : offerPrice}"
          >
            Draft message
          </button>
        </div>
      </div>
    `;
    offerList.appendChild(card);
  });

  offerList.querySelectorAll(".offer-message-button").forEach((button) => {
    button.addEventListener("click", () => {
      openMessageModal({
        label: button.dataset.offerLabel,
        offerPrice: Number(button.dataset.offerPrice),
        hasSalvageTitle,
      });
    });
  });

  insight.textContent = hasSalvageTitle
    ? "These numbers include an additional 40% reduction because salvage and rebuilt titles usually carry a major value hit."
    : "Start near the top if you want a serious conversation. The further down this list you go, the more likely the seller is to ignore you.";
  results.hidden = false;
});

checkerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const carValue = Number(checkerCarValueInput.value);
  const offerValue = Number(checkerOfferValueInput.value);
  const hasSalvageTitle = checkerSalvageTitleInput.checked;

  if (!Number.isFinite(carValue) || carValue <= 0) {
    checkerCarValueInput.focus();
    return;
  }

  if (!Number.isFinite(offerValue) || offerValue <= 0) {
    checkerOfferValueInput.focus();
    return;
  }

  const effectiveValue = getEffectiveValue(carValue, hasSalvageTitle);
  const percentageOff = ((effectiveValue - offerValue) / effectiveValue) * 100;
  const tier = getOfferTier(percentageOff);
  const isOverValue = offerValue > effectiveValue;

  checkerEffectiveValue.textContent = formatCurrency(effectiveValue);
  checkerOfferDisplay.textContent = formatCurrency(offerValue);
  checkerSummaryLabel.textContent = isOverValue ? "Offer status" : "Offer tier";
  checkerTier.textContent = isOverValue ? "Above asking logic" : tier.label;

  if (isOverValue) {
    checkerVerdict.textContent =
      "You are not lowballing. You are offering above the effective value.";
    checkerContext.textContent = hasSalvageTitle
      ? "That comparison already includes the salvage/rebuilt title reduction."
      : "Based on the clean-title value, this is stronger than the calculator's top tier.";
  } else {
    checkerVerdict.textContent = tier.lowball
      ? "Yes, that counts as a lowball."
      : "No, that is still within a reasonable range.";
    checkerContext.textContent = `Your offer is ${Math.max(0, percentageOff).toFixed(1)}% below the ${
      hasSalvageTitle ? "salvage/rebuilt" : "clean-title"
    } value.`;
  }

  checkerResults.hidden = false;
});
