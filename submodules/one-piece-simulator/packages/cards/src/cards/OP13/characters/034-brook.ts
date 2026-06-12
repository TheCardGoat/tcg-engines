import type { CharacterCard } from "@tcg/op-types";
import { op13Brook034I18n } from "./034-brook.i18n.ts";

export const op13Brook034: CharacterCard = {
  id: "OP13-034",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "slash",
  effect:
    '[On Play] If your Leader has the "FILM" or "Straw Hat Crew" type, set up to 1 of your DON!! cards as active.',
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
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13Brook034I18n,
};
