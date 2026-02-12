import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianBadmintonAce: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "6at-1",
      text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
      type: "action",
    },
    {
      effect: {
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      id: "6at-2",
      text: "FAIR PLAY Your characters named Lady Kluck gain Resist +1.",
      type: "action",
    },
  ],
  cardNumber: 176,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "16b563305b1ebac09f45ac449c05181244aff0e5",
  },
  franchise: "Robin Hood",
  fullName: "Maid Marian - Badminton Ace",
  id: "6at",
  inkType: ["sapphire", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maid Marian",
  set: "007",
  strength: 3,
  text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Badminton Ace",
  willpower: 3,
};
