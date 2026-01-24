import type { LocationCard } from "@tcg/lorcana-types";

export const kuzcosPalaceHomeOfTheEmperor: LocationCard = {
  id: "aae",
  cardType: "location",
  name: "Kuzco's Palace",
  version: "Home of the Emperor",
  fullName: "Kuzco's Palace - Home of the Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "003",
  text: "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.",
  cost: 3,
  moveCost: 3,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2514f81045d67354a0f53e0031f8831ef08f7714",
  },
  abilities: [
    {
      id: "aae-1",
      type: "triggered",
      name: "CITY WALLS",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.",
    },
  ],
};
