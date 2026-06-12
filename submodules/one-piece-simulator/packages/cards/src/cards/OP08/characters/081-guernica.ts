import type { CharacterCard } from "@tcg/op-types";
import { op08Guernica081I18n } from "./081-guernica.i18n.ts";

export const op08Guernica081: CharacterCard = {
  id: "OP08-081",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    '[When Attacking] You may place 3 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 0.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Guernica081I18n,
};
