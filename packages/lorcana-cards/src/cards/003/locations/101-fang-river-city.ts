import type { LocationCard } from "@tcg/lorcana-types";

export const fangRiverCity: LocationCard = {
  id: "1bl",
  cardType: "location",
  name: "Fang",
  version: "River City",
  fullName: "Fang - River City",
  inkType: ["emerald"],
  franchise: "Raya and the Last Dragon",
  set: "003",
  text: "SURROUNDED BY WATER Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 101,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ab87ad77d9132e447d7025f86689d1abc0aa9f5d",
  },
  abilities: [
    {
      id: "1bl-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHARACTERS_HERE",
      },
      name: "SURROUNDED BY WATER",
      text: "SURROUNDED BY WATER Characters gain Ward and Evasive while here.",
    },
  ],
};
