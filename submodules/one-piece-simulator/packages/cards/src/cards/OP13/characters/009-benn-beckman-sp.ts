import type { CharacterCard } from "@tcg/op-types";
import { op13BennBeckmanSp009I18n } from "./009-benn-beckman-sp.i18n.ts";

export const op13BennBeckmanSp009: CharacterCard = {
  id: "OP09-009",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP13",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect: "[On Play] Trash up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromField",
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
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13BennBeckmanSp009I18n,
};
