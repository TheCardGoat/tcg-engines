import type { CharacterCard } from "@tcg/op-types";
import { op07Joseph092I18n } from "./092-joseph.i18n.ts";

export const op07Joseph092: CharacterCard = {
  id: "OP07-092",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 1 or less.',
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
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07Joseph092I18n,
};
