import type { LocationCard } from "@tcg/lorcana-types";
import { gamePreserveProtectedLandI18n } from "./102-game-preserve-protected-land.i18n";

export const gamePreserveProtectedLand: LocationCard = {
  id: "NKo",
  canonicalId: "ci_NKo",
  reprints: ["set11-102"],
  cardType: "location",
  name: "Game Preserve",
  version: "Protected Land",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 102,
  rarity: "common",
  cost: 3,
  willpower: 4,
  moveCost: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f25d2634d58b4a00ab2ac2f2753b8116",
    tcgPlayer: 677135,
  },
  text: [
    {
      title: "EASY TO MISS",
      description:
        "While there's a character with Evasive here, this location gains Evasive. (Only characters with Evasive can challenge it.)",
    },
  ],
  abilities: [
    {
      id: "fh4-1",
      name: "EASY TO MISS",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
            {
              type: "has-keyword",
              keyword: "Evasive",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      type: "static",
      text: "EASY TO MISS While there's a character with Evasive here, this location gains Evasive.",
    },
  ],
  i18n: gamePreserveProtectedLandI18n,
};
