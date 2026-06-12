import type { CharacterCard } from "@tcg/op-types";
import { op13TrafalgarLaw031I18n } from "./031-trafalgar-law.i18n.ts";

export const op13TrafalgarLaw031: CharacterCard = {
  id: "OP13-031",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 6000,
  traits: ["FILM Heart Pirates Supernovas"],
  attribute: "slash",
  effect:
    "If you have 1 or less Life cards, this Character gains [Blocker].\n[On Play] You may return 1 of your Characters to the owner's hand: Play up to 1 Character card with a cost of 5 or less from your hand rested.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
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
  i18n: op13TrafalgarLaw031I18n,
};
