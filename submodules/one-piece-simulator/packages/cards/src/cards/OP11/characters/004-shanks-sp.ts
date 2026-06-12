import type { CharacterCard } from "@tcg/op-types";
import { op11ShanksSp004I18n } from "./004-shanks-sp.i18n.ts";

export const op11ShanksSp004: CharacterCard = {
  id: "ST16-004",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP11",
  cost: 9,
  power: 11000,
  traits: ["FILM The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  effect: "[On Play] K.O. up to 1 of your opponent's rested Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11ShanksSp004I18n,
};
