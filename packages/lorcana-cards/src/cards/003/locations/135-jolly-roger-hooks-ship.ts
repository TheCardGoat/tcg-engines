import type { LocationCard } from "@tcg/lorcana-types";

export const jollyRogerHooksShip: LocationCard = {
  abilities: [
    {
      effect: {
        keyword: "Rush",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
      },
      id: "f7n-1",
      text: "LOOK ALIVE, YOU SWABS! Characters gain Rush while here.",
      type: "static",
    },
  ],
  cardNumber: 135,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "36d37324c4f3d29d9f0101c7ee1a08bf9b00908e",
  },
  franchise: "Peter Pan",
  fullName: "Jolly Roger - Hook's Ship",
  id: "f7n",
  inkType: ["ruby"],
  inkable: false,
  lore: 0,
  missingImplementation: true,
  missingTests: true,
  moveCost: 2,
  name: "Jolly Roger",
  set: "003",
  text: "LOOK ALIVE, YOU SWABS! Characters gain Rush while here. (They can challenge the turn they're played.)\nALL HANDS ON DECK! Your Pirate characters may move here for free.",
  version: "Hook's Ship",
};
