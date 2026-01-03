import type { CharacterCard } from "@tcg/lorcana-types";

export const DrFacilierCharlatan: CharacterCard = {
  id: "8u0",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Charlatan",
  fullName: "Dr. Facilier - Charlatan",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  externalIds: {
    ravensburger: "1fd605fe2fe7ee5b8de1e22cc92998c2f04e0304",
  },
  abilities: [
    {
      id: "8u0-1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
