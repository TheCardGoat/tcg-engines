import type { CharacterCard } from "@tcg/op-types";
import { st23Shanks002I18n } from "./st23-002-shanks.i18n.ts";
export const st23Shanks002: CharacterCard = {
  id: "ST23-002",
  canonicalId: "ST23-002",
  slug: "shanks/st23-002",
  name: "Shanks",
  printings: [
    {
      id: "ST23-002",
      artId: "ST23-002",
      setCode: "ST23",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST23-002.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST23",
  cost: 9,
  traits: ["The Four Emperors", "Red-Haired Pirates"],
  power: 10000,
  attribute: "slash",
  effect:
    "If your opponent has a Character with 8000 base power or more, give this card in your hand −3 cost. [On Play] If your Leader has the {Red-Haired Pirates} type or is [Uta], your Leader gains +2000 power until the end of your opponent's next End Phase.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "basePower",
                comparison: "gte",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -3,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Red-Haired Pirates",
                match: "exact",
              },
              {
                condition: "leaderName",
                name: "Uta",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: st23Shanks002I18n,
};
