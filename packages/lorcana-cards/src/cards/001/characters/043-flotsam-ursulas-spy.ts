import type { CharacterCard } from "@tcg/lorcana";

export const flotsamUrsulasSpy: CharacterCard = {
  id: "4d0",
  cardType: "character",
  name: "Flotsam",
  version: "Ursula’s Spy",
  fullName: "Flotsam - Ursula’s Spy",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nDEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 43,
  inkable: false,
  externalIds: {
    ravensburger: "0fb84ba893dbb130cedf653b49ff8e2427440270",
  },
  abilities: [
    {
      id: "4d0-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
    {
      id: "4d0-2",
      text: "DEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
      name: "DEXTEROUS LUNGE",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
