import type { CharacterCard } from "@tcg/op-types";
import { op01GeckoMoria068I18n } from "./068-gecko-moria.i18n.ts";

export const op01GeckoMoria068: CharacterCard = {
  id: "OP01-068",
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
