import type { CharacterCard } from "@tcg/lorcana-types";

export const beastWounded: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "hmw-1",
      name: "THAT HURTS!",
      text: "THAT HURTS! This character enters play with 4 damage.",
      type: "static",
    },
  ],
  cardNumber: 103,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "3f8fb210c1173eefb48305622dfa9ba4ebeeaa26",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Wounded",
  id: "hmw",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Beast",
  set: "004",
  strength: 2,
  text: "THAT HURTS! This character enters play with 4 damage.",
  version: "Wounded",
  willpower: 6,
};
