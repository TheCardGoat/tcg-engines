import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsQuicktempered: CharacterCard = {
  id: "hry",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Quick-Tempered",
  fullName: "Queen of Hearts - Quick-Tempered",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 90,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "401190d7956bd93a5a06f686c3712e4f7bf4936b",
  },
  abilities: [
    {
      id: "hry-1",
      type: "triggered",
      name: "ROYAL RAGE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Queen"],
};
