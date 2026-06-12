import type { CharacterCard } from "@tcg/op-types";
import { op10SanjiSp003I18n } from "./003-sanji-sp.i18n.ts";

export const op10SanjiSp003: CharacterCard = {
  id: "ST14-003",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP10",
  cost: 5,
  power: 6000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] If you have a Character with a cost of 6 or more, K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 6,
              },
            ],
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10SanjiSp003I18n,
};
