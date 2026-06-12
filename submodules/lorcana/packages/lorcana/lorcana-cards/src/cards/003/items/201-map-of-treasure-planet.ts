import type { ItemCard } from "@tcg/lorcana-types";
import { mapOfTreasurePlanetI18n } from "./201-map-of-treasure-planet.i18n";

export const mapOfTreasurePlanet: ItemCard = {
  id: "Bf0",
  canonicalId: "ci_Bf0",
  reprints: ["set3-201"],
  cardType: "item",
  name: "Map of Treasure Planet",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 201,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_07d0c6cc94bc4eee9c5f12d78bc8a84c",
    tcgPlayer: 537395,
  },
  text: [
    {
      title: "KEY TO THE PORTAL",
      description: "{E} — You pay 1 {I} less for the next location you play this turn.",
    },
    {
      title: "SHOW THE WAY",
      description: "You pay 1 {I} less to move your characters to a location.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        cardType: "location",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "7x0-1",
      name: "KEY TO THE PORTAL",
      text: "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.",
      type: "activated",
    },
    {
      effect: {
        reduction: 1,
        type: "move-cost-reduction",
      },
      id: "7x0-2",
      name: "SHOW THE WAY",
      text: "SHOW THE WAY You pay 1 {I} less to move your characters to a location.",
      type: "static",
    },
  ],
  i18n: mapOfTreasurePlanetI18n,
};
