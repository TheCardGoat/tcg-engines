import type { EventCard } from "@tcg/op-types";
import { op13ButAceHereSaidYouDeservedIt019I18n } from "./019-but-ace-here-said-you-deserved-it.i18n.ts";

export const op13ButAceHereSaidYouDeservedIt019: EventCard = {
  id: "OP13-019",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  traits: ["Revolutionary Army Dressrosa"],
  effect:
    "[Main] You may rest 4 of your DON!! cards: Give up to 1 of your opponent's Characters 3000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 3000 power or less.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
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
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op13ButAceHereSaidYouDeservedIt019I18n,
};
