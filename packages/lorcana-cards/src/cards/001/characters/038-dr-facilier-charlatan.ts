import type { CharacterCard } from "@tcg/lorcana";

export const drFacilierCharlatan: CharacterCard = {
  id: "8u0",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Charlatan",
  fullName: "Dr. Facilier - Charlatan",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cardNumber: "038",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "1fd605fe2fe7ee5b8de1e22cc92998c2f04e0304",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "8u0a1",
      text: "Challenger +2",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
