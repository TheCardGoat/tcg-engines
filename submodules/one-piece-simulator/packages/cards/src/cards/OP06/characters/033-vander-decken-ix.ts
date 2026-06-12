import type { CharacterCard } from "@tcg/op-types";
import { op06VanderDeckenIx033I18n } from "./033-vander-decken-ix.i18n.ts";

export const op06VanderDeckenIx033: CharacterCard = {
  id: "OP06-033",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man Flying Pirates"],
  attribute: "ranged",
  effect:
    '[On Play] You may trash 1 "Fish-Man" type card from your hand or 1 [The Ark Noah] from your hand or field: K.O. up to 1 of your opponent\'s rested Characters.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06VanderDeckenIx033I18n,
};
