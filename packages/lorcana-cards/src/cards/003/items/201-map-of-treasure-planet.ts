import type { ItemCard } from "@tcg/lorcana-types";

export const mapOfTreasurePlanet: ItemCard = {
  id: "7x0",
  cardType: "item",
  name: "Map of Treasure Planet",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  text: "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.\nSHOW THE WAY You pay 1 {I} less to move your characters to a location.",
  cost: 3,
  cardNumber: 201,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c88a3b0ee2cffafb524bd6643be8a7150704beb",
  },
  abilities: [
    {
      id: "7x0-1",
      type: "activated",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.",
    },
    {
      id: "7x0-2",
      type: "action",
      effect: {
        type: "move-to-location",
        character: "CHOSEN_CHARACTER_OF_YOURS",
        cost: "normal",
      },
      text: "SHOW THE WAY You pay 1 {I} less to move your characters to a location.",
    },
  ],
};
