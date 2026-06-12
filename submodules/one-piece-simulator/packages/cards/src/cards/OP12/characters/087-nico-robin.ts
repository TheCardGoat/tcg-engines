import type { CharacterCard } from "@tcg/op-types";
import { op12NicoRobin087I18n } from "./087-nico-robin.i18n.ts";

export const op12NicoRobin087: CharacterCard = {
  id: "OP12-087",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP12",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-087_p1_bYi1Dw6.jpg",
      imageId: "OP12-087_p1",
    },
  ],
  effect:
    "If your Leader is [Koala] or [Monkey.D.Luffy], this Character gains [Blocker] and +3 cost.\n[On Play] You may trash 1 card from your hand: If your opponent has 5 or more cards in their hand, your opponent trashes 2 cards from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12NicoRobin087I18n,
};
