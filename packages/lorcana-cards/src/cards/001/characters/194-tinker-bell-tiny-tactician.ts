import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTinyTactician: CharacterCard = {
  id: "s44",
  cardType: "character",
  name: "Tinker Bell",
  version: "Tiny Tactician",
  fullName: "Tinker Bell - Tiny Tactician",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Battle plans** {E} - Draw a card, then choose and discard a card.",
      id: "s44-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
  ],
  classifications: ["Dreamborn", "Ally", "Fairy"],
};
