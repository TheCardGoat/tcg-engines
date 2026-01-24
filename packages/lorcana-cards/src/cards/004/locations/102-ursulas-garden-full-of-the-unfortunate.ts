import type { LocationCard } from "@tcg/lorcana-types";

export const ursulasGardenFullOfTheUnfortunate: LocationCard = {
  id: "1h6",
  cardType: "location",
  name: "Ursula’s Garden",
  version: "Full of the Unfortunate",
  fullName: "Ursula’s Garden - Full of the Unfortunate",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  text: "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bfdd7ccd7b6612d9bacfba22591df0987519db23",
  },
  abilities: [
    {
      id: "1h6-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.",
    },
  ],
};
