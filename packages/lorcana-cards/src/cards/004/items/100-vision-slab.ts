import type { ItemCard } from "@tcg/lorcana-types";

export const visionSlab: ItemCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "an opposing character has damage",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
        type: "conditional",
      },
      id: "1s5-1",
      text: "DANGER REVEALED At the start of your turn, if an opposing character has damage, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 100,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "e6d57ae690cdbb13b3985f7a1f47b40c2fd61080",
  },
  franchise: "Encanto",
  id: "1s5",
  inkType: ["emerald"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Vision Slab",
  set: "004",
  text: "DANGER REVEALED At the start of your turn, if an opposing character has damage, gain 1 lore.\nTRAPPED! Damage counters can't be removed.",
};
