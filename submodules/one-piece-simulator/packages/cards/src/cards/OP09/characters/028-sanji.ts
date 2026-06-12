import type { CharacterCard } from "@tcg/op-types";
import { op09Sanji028I18n } from "./028-sanji.i18n.ts";

export const op09Sanji028: CharacterCard = {
  id: "OP09-028",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "strike",
  effect:
    '[On K.O.] You may add 1 card from the top or bottom of your Life cards to your hand: Play up to 1 "ODYSSEY" or "Straw Hat Crew" type Character card with a cost of 4 or less from your trash rested.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "ODYSSEY",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Sanji028I18n,
};
