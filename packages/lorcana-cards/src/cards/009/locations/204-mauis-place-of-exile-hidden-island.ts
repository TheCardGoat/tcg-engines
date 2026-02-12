import type { LocationCard } from "@tcg/lorcana-types";

export const mauisPlaceOfExileHiddenIsland: LocationCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
        value: 1,
      },
      id: "1pe-1",
      name: "ISOLATED",
      text: "ISOLATED Characters gain Resist +1 while here.",
      type: "static",
    },
  ],
  cardNumber: 204,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "df63a319ee65f482a2cbc5479c989fcbcebad344",
  },
  franchise: "Moana",
  fullName: "Maui's Place of Exile - Hidden Island",
  id: "1pe",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Maui's Place of Exile",
  set: "009",
  text: "ISOLATED Characters gain Resist +1 while here. (Damage dealt to them is reduced by 1.)",
  version: "Hidden Island",
};
