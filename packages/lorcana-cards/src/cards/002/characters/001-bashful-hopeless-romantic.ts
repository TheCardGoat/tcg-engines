import type { CharacterCard } from "@tcg/lorcana-types";

export const bashfulHopelessRomantic: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
      id: "1ff-1",
      text: "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.",
      type: "action",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 4,
  externalIds: {
    ravensburger: "b95e7b9108cbc2a1fc2700fda19b86520ee93c3e",
  },
  franchise: "Snow White",
  fullName: "Bashful - Hopeless Romantic",
  id: "1ff",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Bashful",
  set: "002",
  strength: 2,
  text: "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.",
  version: "Hopeless Romantic",
  willpower: 5,
};
