import type { CharacterCard } from "@tcg/lorcana-types";

export const sleepyNoddingOff: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "1e7-1",
      name: "YAWN!",
      text: "YAWN! This character enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  cost: 2,
  externalIds: {
    ravensburger: "b4eb2bf849d3bb89970a17f46fdc273773c1fe65",
  },
  franchise: "Snow White",
  fullName: "Sleepy - Nodding Off",
  id: "1e7",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Sleepy",
  set: "002",
  strength: 2,
  text: "YAWN! This character enters play exerted.",
  version: "Nodding Off",
  willpower: 3,
};
