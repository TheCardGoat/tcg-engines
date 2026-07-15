import type { LocationCard } from "@tcg/lorcana-types";

export const tropicalRainforestJaguarLair: LocationCard = {
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "n0b-1",
      name: "SNACK TIME Opposing damaged",
      text: "SNACK TIME Opposing damaged characters gain Reckless.",
      type: "static",
    },
  ],
  cardNumber: 102,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "52ec9a7c34475277f634f704e9058f3740be19fe",
  },
  franchise: "Emperors New Groove",
  fullName: "Tropical Rainforest - Jaguar Lair",
  id: "n0b",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Tropical Rainforest",
  set: "005",
  text: "SNACK TIME Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)",
  version: "Jaguar Lair",
};
