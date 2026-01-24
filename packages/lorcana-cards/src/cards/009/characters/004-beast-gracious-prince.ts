import type { CharacterCard } from "@tcg/lorcana-types";

export const beastGraciousPrince: CharacterCard = {
  id: "144",
  cardType: "character",
  name: "Beast",
  version: "Gracious Prince",
  fullName: "Beast - Gracious Prince",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 4,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9092b0fdad63a9babdad3d040dfc08f9ff244126",
  },
  abilities: [
    {
      id: "144-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      name: "FULL DANCE CARD Your Princess",
      text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
