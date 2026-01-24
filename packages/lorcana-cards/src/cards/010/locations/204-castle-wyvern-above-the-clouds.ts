import type { LocationCard } from "@tcg/lorcana-types";

export const castleWyvernAboveTheClouds: LocationCard = {
  id: "hqg",
  cardType: "location",
  name: "Castle Wyvern",
  version: "Above the Clouds",
  fullName: "Castle Wyvern - Above the Clouds",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3feacecee6585dbc2d6c700e8829954a5add3131",
  },
  abilities: [
    {
      id: "hqg-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHARACTERS_HERE",
        value: 1,
      },
      name: "PROTECT THIS CASTLE",
      text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here.",
    },
  ],
};
