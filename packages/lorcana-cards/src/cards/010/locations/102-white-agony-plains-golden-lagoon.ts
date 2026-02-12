import type { LocationCard } from "@tcg/lorcana-types";

export const whiteAgonyPlainsGoldenLagoon: LocationCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "r72-1",
      text: "PURE LIQUID GOLD This location gets +1 {L} for each character here.",
      type: "action",
    },
  ],
  cardNumber: 102,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "6204aa5feff9c42e7474c9a3e3e566653401ad50",
  },
  franchise: "Ducktales",
  fullName: "White Agony Plains - Golden Lagoon",
  id: "r72",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "White Agony Plains",
  set: "010",
  text: "PURE LIQUID GOLD This location gets +1 {L} for each character here.",
  version: "Golden Lagoon",
};
