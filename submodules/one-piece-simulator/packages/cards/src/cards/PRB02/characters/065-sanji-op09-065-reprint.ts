import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiOp09065Reprint065I18n } from "./065-sanji-op09-065-reprint.i18n.ts";

export const prb02SanjiOp09065Reprint065: CharacterCard = {
  id: "OP09-065",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB02",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    '[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: This Character gains [Rush] during this turn. Then, rest up to 1 of your opponent\'s Characters with a cost of 6 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
          {
            action: "rest",
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
                  value: 6,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02SanjiOp09065Reprint065I18n,
};
