import type { CharacterCard } from "@tcg/op-types";
import { op09Sabo104I18n } from "./104-sabo.i18n.ts";

export const op09Sabo104: CharacterCard = {
  id: "OP09-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP09",
  cost: 7,
  power: 7000,
  counter: 1000,
  trigger: "If your Leader is multicolored, draw 2 cards.",
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    '[On Play] Add up to 1 "Revolutionary Army" type Character card from your hand to the top of your Life cards face-up. Then, if you have 2 or more Life cards, add 1 card from the top or bottom of your Life cards to your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
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
            position: "top",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: op09Sabo104I18n,
};
