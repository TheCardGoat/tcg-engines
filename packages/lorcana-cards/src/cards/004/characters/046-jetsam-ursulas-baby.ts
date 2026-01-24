import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamUrsulasBaby: CharacterCard = {
  id: "du5",
  cardType: "character",
  name: "Jetsam",
  version: 'Ursula\'s "Baby"',
  fullName: 'Jetsam - Ursula\'s "Baby"',
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nOMINOUS PAIR Your characters named Flotsam gain Challenger +2.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "31df3c1a9447af75e663dd163f81735bf0f32fd8",
  },
  abilities: [
    {
      id: "du5-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
    {
      id: "du5-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        value: 2,
      },
      text: "OMINOUS PAIR Your characters named Flotsam gain Challenger +2.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
