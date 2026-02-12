import type { ItemCard } from "@tcg/lorcana-types";

export const mapOfTreasurePlanet: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "7x0-1",
      text: "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.",
      type: "activated",
    },
    {
      effect: {
        character: "CHOSEN_CHARACTER_OF_YOURS",
        cost: "normal",
        type: "move-to-location",
      },
      id: "7x0-2",
      text: "SHOW THE WAY You pay 1 {I} less to move your characters to a location.",
      type: "action",
    },
  ],
  cardNumber: 201,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "1c88a3b0ee2cffafb524bd6643be8a7150704beb",
  },
  franchise: "Treasure Planet",
  id: "7x0",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Map of Treasure Planet",
  set: "003",
  text: "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.\nSHOW THE WAY You pay 1 {I} less to move your characters to a location.",
};
