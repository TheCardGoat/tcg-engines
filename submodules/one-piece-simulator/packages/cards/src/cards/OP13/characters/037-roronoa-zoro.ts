import type { CharacterCard } from "@tcg/op-types";
import { op13RoronoaZoro037I18n } from "./037-roronoa-zoro.i18n.ts";

export const op13RoronoaZoro037: CharacterCard = {
  id: "OP13-037",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["FILM Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect:
    '[On Play] If your Leader has the "FILM" or "Straw Hat Crew" type, set up to 2 of your DON!! cards as active.\n[End of Your Turn] Set this Character as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "FILM",
              },
              {
                condition: "leaderTrait",
                trait: "Straw Hat Crew",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op13RoronoaZoro037I18n,
};
