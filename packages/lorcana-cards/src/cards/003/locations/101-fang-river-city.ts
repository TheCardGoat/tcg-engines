import type { LocationCard } from "@tcg/lorcana-types";

export const fangRiverCity: LocationCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHARACTERS_HERE",
      },
      id: "1bl-1",
      name: "SURROUNDED BY WATER",
      text: "SURROUNDED BY WATER Characters gain Ward and Evasive while here.",
      type: "static",
    },
  ],
  cardNumber: 101,
  cardType: "location",
  cost: 4,
  externalIds: {
    ravensburger: "ab87ad77d9132e447d7025f86689d1abc0aa9f5d",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Fang - River City",
  id: "1bl",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Fang",
  set: "003",
  text: "SURROUNDED BY WATER Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  version: "River City",
};
