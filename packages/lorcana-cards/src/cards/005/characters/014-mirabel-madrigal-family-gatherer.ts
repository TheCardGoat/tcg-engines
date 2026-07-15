import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalFamilyGatherer: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1v7-1",
      text: "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.",
      type: "static",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "f283e9f31fd0b57fa5892870d98a03793352b776",
  },
  franchise: "Encanto",
  fullName: "Mirabel Madrigal - Family Gatherer",
  id: "1v7",
  inkType: ["amber"],
  inkable: true,
  lore: 5,
  missingTests: true,
  name: "Mirabel Madrigal",
  set: "005",
  strength: 5,
  text: "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.",
  version: "Family Gatherer",
  willpower: 5,
};
