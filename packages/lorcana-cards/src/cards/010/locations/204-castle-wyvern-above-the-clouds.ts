import type { LocationCard } from "@tcg/lorcana-types";

export const castleWyvernAboveTheClouds: LocationCard = {
  abilities: [
    {
      effect: {
        keyword: "Challenger",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
        value: 1,
      },
      id: "hqg-1",
      name: "PROTECT THIS CASTLE",
      text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here.",
      type: "static",
    },
  ],
  cardNumber: 204,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "3feacecee6585dbc2d6c700e8829954a5add3131",
  },
  franchise: "Gargoyles",
  fullName: "Castle Wyvern - Above the Clouds",
  id: "hqg",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Castle Wyvern",
  set: "010",
  text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)",
  version: "Above the Clouds",
};
