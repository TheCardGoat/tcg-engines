import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamUrsulasBaby: CharacterCard = {
  abilities: [
    {
      id: "du5-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 2,
      },
      id: "du5-2",
      text: "OMINOUS PAIR Your characters named Flotsam gain Challenger +2.",
      type: "action",
    },
  ],
  cardNumber: 46,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "31df3c1a9447af75e663dd163f81735bf0f32fd8",
  },
  franchise: "Little Mermaid",
  fullName: 'Jetsam - Ursula\'s "Baby"',
  id: "du5",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jetsam",
  set: "004",
  strength: 2,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nOMINOUS PAIR Your characters named Flotsam gain Challenger +2.",
  version: 'Ursula\'s "Baby"',
  willpower: 4,
};
