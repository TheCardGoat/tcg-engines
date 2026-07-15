import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseNightWatch: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      id: "byr-1",
      name: "SUPPORT Your Pluto",
      text: "SUPPORT Your Pluto characters get Resist +1.",
      type: "static",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "2b1fcd131a99f947ccd1d9c4c82fc6ae8c9837e1",
  },
  fullName: "Mickey Mouse - Night Watch",
  id: "byr",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mickey Mouse",
  set: "006",
  strength: 2,
  text: "SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Night Watch",
  willpower: 3,
};
