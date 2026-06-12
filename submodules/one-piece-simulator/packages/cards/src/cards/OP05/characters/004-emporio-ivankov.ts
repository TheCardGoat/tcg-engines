import type { CharacterCard } from "@tcg/op-types";
import { op05EmporioIvankov004I18n } from "./004-emporio-ivankov.i18n.ts";

export const op05EmporioIvankov004: CharacterCard = {
  id: "OP05-004",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[Activate:Main][Once Per Turn] If this Character has 7000 power or more, play up to 1 [Revolutionary Army] type Character card with 5000 power or less other than [Emporio.Ivankov] from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 7000,
          },
        ],
        actions: [
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
                filter: "excludeName",
                value: "Emporio.Ivankov",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05EmporioIvankov004I18n,
};
