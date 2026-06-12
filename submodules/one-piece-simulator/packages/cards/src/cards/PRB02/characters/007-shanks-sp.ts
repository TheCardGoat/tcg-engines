import type { CharacterCard } from "@tcg/op-types";
import { prb02ShanksSp007I18n } from "./007-shanks-sp.i18n.ts";

export const prb02ShanksSp007: CharacterCard = {
  id: "OP06-007",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB02",
  cost: 10,
  power: 12000,
  traits: ["FILM The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  effect: "[On play] K.O. up to 1 of your opponent's Characters with 10000 power or less.",
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
                  filter: "power",
                  comparison: "lte",
                  value: 10000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02ShanksSp007I18n,
};
