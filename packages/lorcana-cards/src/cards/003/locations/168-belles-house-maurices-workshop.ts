import type { LocationCard } from "@tcg/lorcana-types";

export const bellesHouseMauricesWorkshop: LocationCard = {
  id: "kt9",
  cardType: "location",
  name: "Belle's House",
  version: "Maurice's Workshop",
  fullName: "Belle's House - Maurice's Workshop",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "003",
  text: "LABORATORY If you have a character here, you pay 1 {I} less to play items.",
  cost: 1,
  moveCost: 2,
  lore: 0,
  cardNumber: 168,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4b02e8ae98da7815714d4cac86d24cb2bcc76501",
  },
  abilities: [
    {
      id: "kt9-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "LABORATORY If you have a character here, you pay 1 {I} less to play items.",
    },
  ],
};
