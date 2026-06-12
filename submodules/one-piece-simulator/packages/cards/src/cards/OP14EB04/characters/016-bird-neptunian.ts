import type { CharacterCard } from "@tcg/op-types";
import { op14eb04BirdNeptunian016I18n } from "./016-bird-neptunian.i18n.ts";

export const op14eb04BirdNeptunian016: CharacterCard = {
  id: "EB04-016",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 5,
  power: 7000,
  traits: ["Neptunian"],
  attribute: "strike",
  effect:
    "[Activate: Main] Set up to 1 of your DON!! cards as active. Then, you cannot set DON!! cards as active using Character effects during this turn.\n[When Attacking] If you have 3 or more {Neptunian} type Characters, rest up to 1 of your opponent's Characters with a cost of 8 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
            filters: [
              {
                filter: "trait",
                value: "Neptunian",
              },
            ],
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
                  value: 8,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04BirdNeptunian016I18n,
};
