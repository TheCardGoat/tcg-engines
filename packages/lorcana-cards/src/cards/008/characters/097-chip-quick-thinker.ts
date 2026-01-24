import type { CharacterCard } from "@tcg/lorcana-types";

export const chipQuickThinker: CharacterCard = {
  id: "1aq",
  cardType: "character",
  name: "Chip",
  version: "Quick Thinker",
  fullName: "Chip - Quick Thinker",
  inkType: ["emerald"],
  franchise: "Rescue Rangers",
  set: "008",
  text: "I’LL HANDLE THIS When you play this character, chosen opponent chooses and discards a card.",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 97,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a86f28f1777738ea9148dc4fa0844fe6fc65452d",
  },
  abilities: [
    {
      id: "1aq-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "I’LL HANDLE THIS When you play this character, chosen opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
