import type { LocationCard } from "@tcg/lorcana-types";

export const ursulasGardenFullOfTheUnfortunate: LocationCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "1h6-1",
      text: "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.",
      type: "static",
    },
  ],
  cardNumber: 102,
  cardType: "location",
  cost: 4,
  externalIds: {
    ravensburger: "bfdd7ccd7b6612d9bacfba22591df0987519db23",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula’s Garden - Full of the Unfortunate",
  id: "1h6",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Ursula’s Garden",
  set: "004",
  text: "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.",
  version: "Full of the Unfortunate",
};
