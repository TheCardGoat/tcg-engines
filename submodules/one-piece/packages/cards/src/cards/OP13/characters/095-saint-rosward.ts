import type { CharacterCard } from "@tcg/op-types";
import { op13SaintRosward095I18n } from "./095-saint-rosward.i18n.ts";

export const op13SaintRosward095: CharacterCard = {
  id: "OP13-095",
  canonicalId: "OP13-095",
  slug: "saint-rosward/op13-095",
  name: "Saint Rosward",
  printings: [
    {
      id: "OP13-095",
      artId: "OP13-095",
      setCode: "OP13",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-095_agyG3al.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "ranged",
  effect:
    '[On Play] You may trash 1 card from your hand: If you only have "Celestial Dragons" type Characters, K.O. up to 2 of your opponent\'s Characters with a base cost of 3 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "eq",
              value: 0,
              filters: [
                {
                  filter: "trait",
                  value: "Celestial Dragons",
                  match: "includes",
                  negate: true,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13SaintRosward095I18n,
};
