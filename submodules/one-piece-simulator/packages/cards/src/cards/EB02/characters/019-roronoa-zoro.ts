import type { CharacterCard } from "@tcg/op-types";
import { eb02RoronoaZoro019I18n } from "./019-roronoa-zoro.i18n.ts";

export const eb02RoronoaZoro019: CharacterCard = {
  id: "EB02-019",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew East Blue"],
  attribute: "slash",
  effect:
    'If your opponent has 2 or more Characters, this Character can attack Characters on the turn in which it is played.\n[On Play] If your Leader has the "Straw Hat Crew" type, rest up to 1 of your opponent\'s Characters with a cost of 4 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb02RoronoaZoro019I18n,
};
