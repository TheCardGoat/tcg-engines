import type { CharacterCard } from "@tcg/op-types";
import { op13York094I18n } from "./094-york.i18n.ts";

export const op13York094: CharacterCard = {
  id: "OP13-094",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    '[On Play] Up to 1 of your "Celestial Dragons" type Characters gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
                  value: "Celestial Dragons",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13York094I18n,
};
