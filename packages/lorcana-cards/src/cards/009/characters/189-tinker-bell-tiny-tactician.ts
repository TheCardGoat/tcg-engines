import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellTinyTactician: CharacterCard = {
  id: "n9y",
  cardType: "character",
  name: "Tinker Bell",
  version: "Tiny Tactician",
  fullName: "Tinker Bell - Tiny Tactician",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "009",
  text: "BATTLE PLANS {E} — Draw a card, then choose and discard a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 189,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "53e3a38f0b94170b6766ad77868a9a1f3f572889",
  },
  abilities: [
    {
      id: "n9y-1",
      type: "activated",
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
      text: "BATTLE PLANS {E} — Draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Fairy"],
};
