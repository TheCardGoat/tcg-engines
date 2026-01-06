import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const tinkerBell: CharacterCard = {
  id: "s44",
  cardType: "character",
  name: "Tinker Bell",
  version: "Tiny Tactician",
  fullName: "Tinker Bell - Tiny Tactician",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 488544,
  },
  classifications: ["Dreamborn", "Ally", "Fairy"],
  abilities: [
    {
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [],
      },
      name: "Battle plans",
      id: "s44-1",
      text: "Draw a card, then choose and discard a card.",
    },
  ],
};
