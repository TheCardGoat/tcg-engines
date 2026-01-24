import type { CharacterCard } from "@tcg/lorcana-types";

export const bashfulHopelessRomantic: CharacterCard = {
  id: "1ff",
  cardType: "character",
  name: "Bashful",
  version: "Hopeless Romantic",
  fullName: "Bashful - Hopeless Romantic",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 3,
  cardNumber: 1,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b95e7b9108cbc2a1fc2700fda19b86520ee93c3e",
  },
  abilities: [
    {
      id: "1ff-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
      text: "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};
