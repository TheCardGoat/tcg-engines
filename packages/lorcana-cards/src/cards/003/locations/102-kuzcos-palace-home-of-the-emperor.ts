import type { LocationCard } from "@tcg/lorcana-types";

export const kuzcosPalaceHomeOfTheEmperor: LocationCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "banish",
      },
      id: "aae-1",
      name: "CITY WALLS",
      text: "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 102,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "2514f81045d67354a0f53e0031f8831ef08f7714",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco's Palace - Home of the Emperor",
  id: "aae",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 3,
  name: "Kuzco's Palace",
  set: "003",
  text: "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.",
  version: "Home of the Emperor",
};
