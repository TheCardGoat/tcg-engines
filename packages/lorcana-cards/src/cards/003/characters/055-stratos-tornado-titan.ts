import type { CharacterCard } from "@tcg/lorcana-types";

export const stratosTornadoTitan: CharacterCard = {
  id: "14b",
  cardType: "character",
  name: "Stratos",
  version: "Tornado Titan",
  fullName: "Stratos - Tornado Titan",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nCYCLONE {E} — Gain lore equal to the number of Titan characters you have in play.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 0,
  cardNumber: 55,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9155d58b6e558f58fcffee4ccc7f4308e8834c1d",
  },
  abilities: [
    {
      id: "14b-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Titan"],
};
