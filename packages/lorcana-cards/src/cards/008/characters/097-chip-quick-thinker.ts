import type { CharacterCard } from "@tcg/lorcana-types";

export const chipQuickThinker: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1aq-1",
      text: "I’LL HANDLE THIS When you play this character, chosen opponent chooses and discards a card.",
      type: "action",
    },
  ],
  cardNumber: 97,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "a86f28f1777738ea9148dc4fa0844fe6fc65452d",
  },
  franchise: "Rescue Rangers",
  fullName: "Chip - Quick Thinker",
  id: "1aq",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Chip",
  set: "008",
  strength: 3,
  text: "I’LL HANDLE THIS When you play this character, chosen opponent chooses and discards a card.",
  version: "Quick Thinker",
  willpower: 2,
};
