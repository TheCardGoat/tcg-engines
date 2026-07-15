import type { CharacterCard } from "@tcg/op-types";
import { op01GeckoMoria068I18n } from "./068-gecko-moria.i18n.ts";

export const op01GeckoMoria068: CharacterCard = {
  id: "OP01-068",
  canonicalId: "OP01-068",
  slug: "gecko-moria/op01-068",
  name: "Gecko Moria",
  printings: [
    {
      id: "OP01-068",
      artId: "OP01-068",
      setCode: "OP01",
      collectorNumber: "068",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-068.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] This Character gains [Double Attack] if you have 5 or more cards in your hand. (This card deals 2 damage.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "doubleAttack",
            duration: "permanent",
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "gte",
              value: 5,
            },
          },
        ],
      },
    ],
  },
  i18n: op01GeckoMoria068I18n,
};
