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
const results = document.querySelector("#results");
const resultsValue = document.querySelector("#results-value");
const salvageValueBlock = document.querySelector("#salvage-value-block");
const salvageResultsValue = document.querySelector("#salvage-results-value");
const offerList = document.querySelector("#offer-list");
const insight = document.querySelector("#insight");
const messageModal = document.querySelector("#message-modal");
const messageOfferLabel = document.querySelector("#message-offer-label");
const messageText = document.querySelector("#message-text");
const copyMessageButton = document.querySelector("#copy-message");
const closeModalButton = document.querySelector("#close-modal");

const SALVAGE_DISCOUNT = 0.4;

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
  salvageResultsValue.textContent = formatCurrency(carValue * (1 - SALVAGE_DISCOUNT));
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
