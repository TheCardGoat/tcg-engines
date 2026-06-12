import type { CharacterCard } from "@tcg/op-types";
import { op03Sham027I18n } from "./027-sham.i18n.ts";

export const op03Sham027: CharacterCard = {
  id: "OP03-027",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["East Blue Black Cat Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the [East Blue] type, rest up to 1 of your opponent's Characters with a cost of 2 or less and, if you don't have [Buchi], play up to 1 [Buchi] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "East Blue",
          },
        ],
        actions: [
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
                  value: 2,
                },
              ],
            },
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Buchi",
              },
            ],
            condition: {
              condition: "notHasCard",
              player: "self",
              zone: "field",
              filters: [
                {
                  filter: "name",
                  value: "Buchi",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03Sham027I18n,
};
