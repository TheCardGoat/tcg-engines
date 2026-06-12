import type { CharacterCard } from "@tcg/op-types";
import { op12Sentomaru104I18n } from "./104-sentomaru.i18n.ts";

export const op12Sentomaru104: CharacterCard = {
  id: "OP12-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Navy Egghead"],
  attribute: "slash",
  effect: "[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12Sentomaru104I18n,
};
