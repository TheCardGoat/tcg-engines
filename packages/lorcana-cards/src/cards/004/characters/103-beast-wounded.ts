import type { CharacterCard } from "@tcg/lorcana-types";

export const beastWounded: CharacterCard = {
  id: "hmw",
  cardType: "character",
  name: "Beast",
  version: "Wounded",
  fullName: "Beast - Wounded",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "THAT HURTS! This character enters play with 4 damage.",
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3f8fb210c1173eefb48305622dfa9ba4ebeeaa26",
  },
  abilities: [
    {
      id: "hmw-1",
      type: "static",
      effect: {
        type: "play-card",
        from: "hand",
      },
      name: "THAT HURTS!",
      text: "THAT HURTS! This character enters play with 4 damage.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
