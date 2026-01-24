import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraCaptivatingCynic: CharacterCard = {
  id: "13g",
  cardType: "character",
  name: "Megara",
  version: "Captivating Cynic",
  fullName: "Megara - Captivating Cynic",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "SHADY DEAL When you play this character, choose and discard a card or banish this character.",
  cost: 3,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 79,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8e31efeb3393cdf6117bf0de38f47c93204d5f89",
  },
  abilities: [
    {
      id: "13g-1",
      type: "triggered",
      name: "SHADY DEAL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "choice",
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
        optionLabels: ["choose and discard a card", "banish this character."],
      },
      text: "SHADY DEAL When you play this character, choose and discard a card or banish this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
