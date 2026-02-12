import type { CharacterCard } from "@tcg/lorcana-types";

export const theWardrobePerceptiveFriend: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "s0r-1",
      text: "I HAVE JUST THE THING! , Choose and discard an item card — Draw 2 cards.",
      type: "action",
    },
  ],
  cardNumber: 160,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "64fdaa7af3643b25a77f4fd8026e6e4394b74a3b",
  },
  franchise: "Beauty and the Beast",
  fullName: "The Wardrobe - Perceptive Friend",
  id: "s0r",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "The Wardrobe",
  set: "008",
  strength: 3,
  text: "I HAVE JUST THE THING! , Choose and discard an item card — Draw 2 cards.",
  version: "Perceptive Friend",
  willpower: 4,
};
