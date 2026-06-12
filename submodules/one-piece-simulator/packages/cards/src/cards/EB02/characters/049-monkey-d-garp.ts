import type { CharacterCard } from "@tcg/op-types";
import { eb02MonkeyDGarp049I18n } from "./049-monkey-d-garp.i18n.ts";

export const eb02MonkeyDGarp049: CharacterCard = {
  id: "EB02-049",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB02",
  cost: 5,
  power: 6000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] Give up to 2 rested DON!! cards to 1 of your Leader.\n[Activate: Main] You may rest this Character: If your Leader is [Monkey.D.Garp], K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Monkey.D.Garp",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
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
  i18n: eb02MonkeyDGarp049I18n,
};
