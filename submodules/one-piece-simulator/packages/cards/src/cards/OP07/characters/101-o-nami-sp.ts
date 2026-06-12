import type { CharacterCard } from "@tcg/op-types";
import { op07ONamiSp101I18n } from "./101-o-nami-sp.i18n.ts";

export const op07ONamiSp101: CharacterCard = {
  id: "OP06-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[On Play] Up to 1 of your Leader or Character cards gains [Banish] during this turn. (When this card deals damage, the target card is trashed without activating its Trigger.) [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07ONamiSp101I18n,
};
