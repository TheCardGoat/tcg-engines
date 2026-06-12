import type { CharacterCard } from "@tcg/op-types";
import { op06SugarSp024I18n } from "./024-sugar-sp.i18n.ts";

export const op06SugarSp024: CharacterCard = {
  id: "OP04-024",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP06",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Opponent's Turn][Once Per Turn] When your opponent plays a Character, if your Leader has the [Donquixote Pirates] type, rest up to 1 of your opponent's Characters. Then, rest this Character.\n[On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op06SugarSp024I18n,
};
