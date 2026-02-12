import type { LocationCard } from "@tcg/lorcana-types";

export const hiddenCoveTranquilHaven: LocationCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1ts-1",
      name: "REVITALIZING WATERS",
      text: "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.",
      type: "static",
    },
  ],
  cardNumber: 102,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "ed1ae5d7eae7e91e80de930096d8be65b9f13e21",
  },
  franchise: "Lorcana",
  fullName: "Hidden Cove - Tranquil Haven",
  id: "1ts",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Hidden Cove",
  set: "009",
  text: "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.",
  version: "Tranquil Haven",
};
