import type { CharacterCard } from "@tcg/op-types";
import { op04SakazukiSp099I18n } from "./099-sakazuki-sp.i18n.ts";

export const op04SakazukiSp099: CharacterCard = {
  id: "OP02-099",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP04",
  cost: 6,
  power: 7000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
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
        optional: true,
      },
    ],
  },
  i18n: op04SakazukiSp099I18n,
};
