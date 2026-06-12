import type { CharacterCard } from "@tcg/op-types";
import { op13DouglasBullet068I18n } from "./068-douglas-bullet.i18n.ts";

export const op13DouglasBullet068: CharacterCard = {
  id: "OP13-068",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Former Roger Pirates"],
  attribute: "special",
  effect:
    'If you have 8 or more DON!! cards on your field, this Character gains +2000 power.\n[On Play] If your Leader\'s type includes "Roger Pirates", add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Roger Pirates",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13DouglasBullet068I18n,
};
