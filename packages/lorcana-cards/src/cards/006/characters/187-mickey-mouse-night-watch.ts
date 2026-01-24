import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseNightWatch: CharacterCard = {
  id: "byr",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Night Watch",
  fullName: "Mickey Mouse - Night Watch",
  inkType: ["steel"],
  set: "006",
  text: "SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 187,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b1fcd131a99f947ccd1d9c4c82fc6ae8c9837e1",
  },
  abilities: [
    {
      id: "byr-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      name: "SUPPORT Your Pluto",
      text: "SUPPORT Your Pluto characters get Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
