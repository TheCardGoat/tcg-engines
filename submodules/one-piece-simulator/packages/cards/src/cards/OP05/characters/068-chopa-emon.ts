import type { CharacterCard } from "@tcg/op-types";
import { op05ChopaEmon068I18n } from "./068-chopa-emon.i18n.ts";

export const op05ChopaEmon068: CharacterCard = {
  id: "OP05-068",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[On Play] If you have 8 or more DON!! cards on your field, set up to 1 of your purple [Straw Hat Crew] type Characters with 6000 power or less as active.",
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "purple",
                },
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                },
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
  i18n: op05ChopaEmon068I18n,
};
