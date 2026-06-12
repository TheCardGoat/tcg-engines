import type { CharacterCard } from "@tcg/op-types";
import { op12Kuina026I18n } from "./026-kuina.i18n.ts";

export const op12Kuina026: CharacterCard = {
  id: "OP12-026",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP12",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["East Blue Frost Moon Village"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character: Rest up to 1 of your opponent's Characters with a base cost of 4 or less. Then, give up to 3 rested DON!! cards to your [Roronoa Zoro] Leader.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Roronoa Zoro",
                },
              ],
            },
            count: {
              amount: 3,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Kuina026I18n,
};
