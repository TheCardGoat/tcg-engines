import type { CharacterCard } from "@tcg/op-types";
import { eb03Ulti039I18n } from "./039-ulti.i18n.ts";

export const eb03Ulti039: CharacterCard = {
  id: "EB03-039",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB03",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the {Animal Kingdom Pirates} type, draw 1 card and trash 1 card from your hand. Then, play up to 1 Character card with 6000 power or less and no base effect from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "hasEffectType",
                value: "onPlay",
                negate: true,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb03Ulti039I18n,
};
