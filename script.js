const OFFERS = [
  { label: "Good Offer", discount: 10 },
  { label: "OK Offer", discount: 15 },
  { label: "Lowball Offer", discount: 20 },
  { label: "Super Lowball Offer", discount: 25 },
  { label: "Troll Offer", discount: 30 },
  { label: "Late Night Facebook Offer", discount: 60 },
];

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
    "Good Offer": [
      `Hi, I’m interested in your vehicle. Based on the value and current market, I’d like to offer ${formattedPrice}.${titleNote} If that works for you, I’d be glad to set up a time to come see it.`,
      `Hello, I reviewed the pricing and would be comfortable offering ${formattedPrice}.${titleNote} If that sounds reasonable, I’d be happy to coordinate a time to look at it.`,
      `Hi there, after comparing values, my offer would be ${formattedPrice}.${titleNote} Let me know if you’d like to discuss it further.`,
      `Good afternoon, I’m seriously interested and would like to offer ${formattedPrice}.${titleNote} If you are open to that number, I can move forward quickly.`,
      `Hello, based on the market and the vehicle details, I’d be at ${formattedPrice}.${titleNote} If that fits what you had in mind, I’d like to continue the conversation.`,
    ],
    "OK Offer": [
      `Hey, I took a look at the numbers and I’d be at ${formattedPrice}.${titleNote} Let me know if that’s in the ballpark and we can talk.`,
      `Hey, I’d probably come in around ${formattedPrice}.${titleNote} If that works for you, I’m interested.`,
      `I checked the value and I’d be around ${formattedPrice}.${titleNote} Let me know if you want to work something out.`,
      `Hey, I could do ${formattedPrice}.${titleNote} If we’re close, I’d be down to chat more.`,
      `I’d be at about ${formattedPrice}.${titleNote} If that’s reasonable on your end, let me know.`,
    ],
    "Lowball Offer": [
      `Hey, I’d be around ${formattedPrice} on it.${titleNote} If you want to move it quickly, I can make that happen.`,
      `I’d probably be closer to ${formattedPrice}.${titleNote} If you’re trying to sell fast, let me know.`,
      `Hey, my number would be ${formattedPrice}.${titleNote} If you want a straightforward deal, I’m interested.`,
      `I’m at ${formattedPrice} for it.${titleNote} If that gets it done, I can move pretty quick.`,
      `Realistically I’d be around ${formattedPrice}.${titleNote} Let me know if you want to make something happen.`,
    ],
    "Super Lowball Offer": [
      `Alright, here’s my slightly disrespectful but still real number: ${formattedPrice}.${titleNote} If you’re tired of looking at it, I can come get it.`,
      `I’m going to skip the warm-up and say ${formattedPrice}.${titleNote} If that makes you roll your eyes, fair enough.`,
      `My number is ${formattedPrice}.${titleNote} Not saying you’ll love it, but I am saying it’s real.`,
      `Here’s the mildly insulting version: ${formattedPrice}.${titleNote} If you want it gone, I’m around.`,
      `I know this is a little aggressive, but I’d be at ${formattedPrice}.${titleNote} If you’re done waiting for a better offer, let me know.`,
    ],
    "Troll Offer": [
      `I’ll save both of us some time: ${formattedPrice}.${titleNote} If that sounds offensive, that probably means we’re accurately measuring the gap here.`,
      `Let’s skip pretending and go straight to ${formattedPrice}.${titleNote} You can hate it, but that’s my number.`,
      `Here’s the part where I offend you with ${formattedPrice}.${titleNote} If you still want to reply, I respect the dedication.`,
      `I’m at ${formattedPrice}.${titleNote} I know that’s rude, but at least it’s efficient.`,
      `You’re probably not going to like this, but ${formattedPrice}.${titleNote} That’s the offer.`,
    ],
    "Late Night Facebook Offer": [
      `Best I can do is ${formattedPrice}.${titleNote} Cash, minimal conversation, and I promise to act like I’m doing you a favor the entire time.`,
      `It’s 11:47 PM somewhere, so here’s the offer: ${formattedPrice}.${titleNote} Take it or leave it, preferably without a paragraph.`,
      `I’ll be blunt: ${formattedPrice}.${titleNote} Cash in hand and absolutely no interest in hearing about how much work you put into it.`,
      `My late-night marketplace number is ${formattedPrice}.${titleNote} If you want full price, I recommend a different inbox.`,
      `Here’s the rude Facebook special: ${formattedPrice}.${titleNote} I can pick it up fast and complain about traffic on the way there.`,
    ],
  };

  return templates[label];
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const init = () => {
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
  const retryMessageButton = document.querySelector("#retry-message");
  const copyMessageButton = document.querySelector("#copy-message");
  const closeModalButton = document.querySelector("#close-modal");
  let activeMessageState = null;

  if (
    !form ||
    !valueInput ||
    !salvageTitleInput ||
    !checkerForm ||
    !checkerCarValueInput ||
    !checkerOfferValueInput ||
    !checkerSalvageTitleInput ||
    !results ||
    !resultsValue ||
    !salvageValueBlock ||
    !salvageResultsValue ||
    !offerList ||
    !insight ||
    !checkerResults ||
    !checkerEffectiveValue ||
    !checkerOfferDisplay ||
    !checkerSummaryLabel ||
    !checkerTier ||
    !checkerVerdict ||
    !checkerContext ||
    !messageModal ||
    !messageOfferLabel ||
    !messageText ||
    !retryMessageButton ||
    !copyMessageButton ||
    !closeModalButton
  ) {
    return;
  }

  const buildMessageState = ({ label, offerPrice, hasSalvageTitle }) => {
    const messages = getDraftMessage({ label, offerPrice, hasSalvageTitle });
    const startIndex = Math.floor(Math.random() * messages.length);

    return {
      label,
      offerPrice,
      hasSalvageTitle,
      messages,
      currentIndex: startIndex,
      remainingIndexes: messages
        .map((_, index) => index)
        .filter((index) => index !== startIndex),
    };
  };

  const renderActiveMessage = () => {
    if (!activeMessageState) {
      return;
    }

    messageOfferLabel.textContent = `${activeMessageState.label} message draft`;
    messageText.value =
      activeMessageState.messages[activeMessageState.currentIndex];
    retryMessageButton.disabled = activeMessageState.messages.length <= 1;
  };

  const openMessageModal = ({ label, offerPrice, hasSalvageTitle }) => {
    activeMessageState = buildMessageState({
      label,
      offerPrice,
      hasSalvageTitle,
    });
    renderActiveMessage();

    if (typeof messageModal.showModal === "function") {
      messageModal.showModal();
      return;
    }

    window.alert(messageText.value);
  };

  retryMessageButton.addEventListener("click", () => {
    if (!activeMessageState) {
      return;
    }

    if (activeMessageState.remainingIndexes.length === 0) {
      activeMessageState.remainingIndexes = activeMessageState.messages
        .map((_, index) => index)
        .filter((index) => index !== activeMessageState.currentIndex);
    }

    const nextPoolIndex = Math.floor(
      Math.random() * activeMessageState.remainingIndexes.length
    );
    const nextIndex = activeMessageState.remainingIndexes.splice(
      nextPoolIndex,
      1
    )[0];

    activeMessageState.currentIndex = nextIndex;
    renderActiveMessage();
  });

  copyMessageButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(messageText.value);
    copyMessageButton.textContent = "Copied";
    window.setTimeout(() => {
      copyMessageButton.textContent = "Copy message";
    }, 1500);
  });

  closeModalButton.addEventListener("click", () => {
    if (typeof messageModal.close === "function") {
      messageModal.close();
    }
  });

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
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
