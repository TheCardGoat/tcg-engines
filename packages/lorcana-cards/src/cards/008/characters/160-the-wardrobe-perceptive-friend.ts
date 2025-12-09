import type { CharacterCard } from "@tcg/lorcana";

export const theWardrobePerceptiveFriend: CharacterCard = {
  id: "s0r",
  cardType: "character",
  name: "The Wardrobe",
  version: "Perceptive Friend",
  fullName: "The Wardrobe - Perceptive Friend",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "I HAVE JUST THE THING! , Choose and discard an item card — Draw 2 cards.",
  cardNumber: "160",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "64fdaa7af3643b25a77f4fd8026e6e4394b74a3b",
  },
  abilities: [
    {
      id: "s0r-1",
      name: "I HAVE JUST THE",
      text: "I HAVE JUST THE THING! , Choose and discard an item card — Draw 2 cards.",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
