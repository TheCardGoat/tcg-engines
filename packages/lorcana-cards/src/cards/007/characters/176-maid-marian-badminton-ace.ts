import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianBadmintonAce: CharacterCard = {
  id: "6at",
  cardType: "character",
  name: "Maid Marian",
  version: "Badminton Ace",
  fullName: "Maid Marian - Badminton Ace",
  inkType: ["sapphire", "steel"],
  franchise: "Robin Hood",
  set: "007",
  text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 176,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "16b563305b1ebac09f45ac449c05181244aff0e5",
  },
  abilities: [
    {
      id: "6at-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "GOOD SHOT During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
    },
    {
      id: "6at-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      text: "FAIR PLAY Your characters named Lady Kluck gain Resist +1.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
