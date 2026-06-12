import type { LocationCard } from "@tcg/lorcana-types";
import { treasureMountainAzuriteSeaIslandI18n } from "./203-treasure-mountain-azurite-sea-island.i18n";

export const treasureMountainAzuriteSeaIsland: LocationCard = {
  id: "3j2",
  canonicalId: "ci_To9",
  reprints: ["set6-203"],
  cardType: "location",
  name: "Treasure Mountain",
  version: "Azurite Sea Island",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 203,
  rarity: "rare",
  cost: 5,
  willpower: 9,
  moveCost: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c343d1fc29f3491f95bb460c90e081a7",
    tcgPlayer: 593162,
  },
  text: [
    {
      title: "SECRET WEAPON",
      description:
        "At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
    },
  ],
  abilities: [
    {
      id: "7id-1",
      name: "SECRET WEAPON",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        amount: {
          type: "source-attribute",
          attribute: "chars-at-location",
        },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "location"],
        },
        type: "deal-damage",
      },
      text: "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
      type: "triggered",
    },
  ],
  i18n: treasureMountainAzuriteSeaIslandI18n,
};
