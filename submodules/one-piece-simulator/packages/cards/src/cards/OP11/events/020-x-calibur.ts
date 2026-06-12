import type { EventCard } from "@tcg/op-types";
import { op11XCalibur020I18n } from "./020-x-calibur.i18n.ts";

export const op11XCalibur020: EventCard = {
  id: "OP11-020",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP11",
  cost: 2,
  trigger: "K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  traits: ["Drake Pirates Navy SWORD"],
  effect:
    '[Main] Give up to 2 of your opponent\'s Characters 2000 power during this turn. Then, up to 1 of your "Navy" type Characters gains +1000 power during this turn.',
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
                amount: 2,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Navy",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11XCalibur020I18n,
};
