import type { CharacterCard } from "@tcg/op-types";
import { op12Karasu085I18n } from "./085-karasu.i18n.ts";

export const op12Karasu085: CharacterCard = {
  id: "OP12-085",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    'If your Leader has the "Revolutionary Army" type, this Character gains +3 cost.\n[When Attacking] If your Leader has the "Revolutionary Army" type and your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Revolutionary Army",
              },
              {
                condition: "handCount",
                player: "opponent",
                comparison: "gte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op12Karasu085I18n,
};
