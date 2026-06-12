import type { CharacterCard } from "@tcg/op-types";
import { op10Shiryu086I18n } from "./086-shiryu.i18n.ts";

export const op10Shiryu086: CharacterCard = {
  id: "OP10-086",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "slash",
  effect:
    "[Opponent's Turn] This Character gains +2000 power.\n[Activate: Main] [Once Per Turn] If your Leader has the \"Blackbeard Pirates\" type, and this Character was played on this turn, K.O. up to 1 of your opponent's Characters with a base cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Blackbeard Pirates",
              },
              {
                condition: "playedThisTurn",
              },
            ],
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
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
          },
        ],
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10Shiryu086I18n,
};
