import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsQuicktempered: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "hry-1",
      name: "ROYAL RAGE",
      text: "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Queen"],
  cost: 2,
  externalIds: {
    ravensburger: "401190d7956bd93a5a06f686c3712e4f7bf4936b",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Quick-Tempered",
  id: "hry",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Queen of Hearts",
  set: "002",
  strength: 1,
  text: "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.",
  version: "Quick-Tempered",
  willpower: 2,
};
