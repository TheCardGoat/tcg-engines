import type { CharacterCard } from "@tcg/op-types";
import { op09RobLucciSp093I18n } from "./093-rob-lucci-sp.i18n.ts";

export const op09RobLucciSp093: CharacterCard = {
  id: "OP05-093",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP09",
  cost: 4,
  power: 6000,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    "[On Play] You may place 3 cards from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent's Characters with a cost of 2 or less and up to 1 of your opponent's Characters with a cost of 1 or less.",
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
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09RobLucciSp093I18n,
};
