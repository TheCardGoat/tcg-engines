import type { CharacterCard } from "@tcg/op-types";
import { op05ORobi063I18n } from "./063-o-robi.i18n.ts";

export const op05ORobi063: CharacterCard = {
  id: "OP05-063",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] If you have 8 or more DON!! cards on your field, K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05ORobi063I18n,
};
