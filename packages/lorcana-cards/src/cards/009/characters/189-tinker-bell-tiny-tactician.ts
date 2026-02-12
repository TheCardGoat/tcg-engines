import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTinyTactician: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
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
        type: "sequence",
      },
      id: "n9y-1",
      text: "BATTLE PLANS {E} — Draw a card, then choose and discard a card.",
      type: "activated",
    },
  ],
  cardNumber: 189,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Fairy"],
  cost: 3,
  externalIds: {
    ravensburger: "53e3a38f0b94170b6766ad77868a9a1f3f572889",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Tiny Tactician",
  id: "n9y",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tinker Bell",
  set: "009",
  strength: 2,
  text: "BATTLE PLANS {E} — Draw a card, then choose and discard a card.",
  version: "Tiny Tactician",
  willpower: 4,
};
