import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraCaptivatingCynic: CharacterCard = {
  abilities: [
    {
      effect: {
        optionLabels: ["choose and discard a card", "banish this character."],
        options: [
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
          {
            type: "banish",
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
        type: "choice",
      },
      id: "13g-1",
      name: "SHADY DEAL",
      text: "SHADY DEAL When you play this character, choose and discard a card or banish this character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 79,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "8e31efeb3393cdf6117bf0de38f47c93204d5f89",
  },
  franchise: "Hercules",
  fullName: "Megara - Captivating Cynic",
  id: "13g",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Megara",
  set: "004",
  strength: 3,
  text: "SHADY DEAL When you play this character, choose and discard a card or banish this character.",
  version: "Captivating Cynic",
  willpower: 6,
};
