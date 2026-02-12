import type { LocationCard } from "@tcg/lorcana-types";

export const bellesHouseMauricesWorkshop: LocationCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character here",
          type: "if",
        },
        then: {
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "kt9-1",
      text: "LABORATORY If you have a character here, you pay 1 {I} less to play items.",
      type: "action",
    },
  ],
  cardNumber: 168,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "4b02e8ae98da7815714d4cac86d24cb2bcc76501",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle's House - Maurice's Workshop",
  id: "kt9",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Belle's House",
  set: "003",
  text: "LABORATORY If you have a character here, you pay 1 {I} less to play items.",
  version: "Maurice's Workshop",
};
