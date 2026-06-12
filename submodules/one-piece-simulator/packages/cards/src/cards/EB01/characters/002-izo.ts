import type { CharacterCard } from "@tcg/op-types";
import { eb01Izo002I18n } from "./002-izo.i18n.ts";

export const eb01Izo002: CharacterCard = {
  id: "EB01-002",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB01",
  cost: 5,
  power: 7000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "ranged",
  effect:
    "[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.[On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: If your Leader has the [Land of Wano] or [Whitebeard Pirates] type, give up to 1 of your opponent's Leader or Character cards -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Land of Wano",
              },
              {
                condition: "leaderTrait",
                trait: "Whitebeard Pirates",
              },
            ],
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01Izo002I18n,
};
