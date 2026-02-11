import type { CharacterCard } from "@tcg/lorcana-types";

export const beastGraciousPrince: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      id: "144-1",
      name: "FULL DANCE CARD Your Princess",
      text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
      type: "static",
    },
  ],
  cardNumber: 4,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "9092b0fdad63a9babdad3d040dfc08f9ff244126",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Gracious Prince",
  id: "144",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Beast",
  set: "009",
  strength: 5,
  text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
  version: "Gracious Prince",
  willpower: 4,
};
