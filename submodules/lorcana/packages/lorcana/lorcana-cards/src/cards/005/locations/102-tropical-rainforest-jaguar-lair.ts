import type { LocationCard } from "@tcg/lorcana-types";
import { tropicalRainforestJaguarLairI18n } from "./102-tropical-rainforest-jaguar-lair.i18n";

export const tropicalRainforestJaguarLair: LocationCard = {
  id: "PvR",
  canonicalId: "ci_PvR",
  reprints: ["set5-102"],
  cardType: "location",
  name: "Tropical Rainforest",
  version: "Jaguar Lair",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 102,
  rarity: "uncommon",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_85d29b6399cc45b696b6f1e9abe19910",
    tcgPlayer: 560240,
  },
  text: [
    {
      title: "SNACK TIME",
      description:
        "Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "damaged",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "n0b-1",
      name: "SNACK TIME",
      text: "SNACK TIME Opposing damaged characters gain Reckless.",
      type: "static",
    },
  ],
  i18n: tropicalRainforestJaguarLairI18n,
};
