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
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  externalIds: {
    ravensburger: "64fdaa7af3643b25a77f4fd8026e6e4394b74a3b",
  },
  abilities: [
    {
      id: "s0r-1",
      text: "I HAVE JUST THE THING! , Choose and discard an item card — Draw 2 cards.",
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
