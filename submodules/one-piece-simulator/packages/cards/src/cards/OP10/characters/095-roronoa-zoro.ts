import type { CharacterCard } from "@tcg/op-types";
import { op10RoronoaZoro095I18n } from "./095-roronoa-zoro.i18n.ts";

export const op10RoronoaZoro095: CharacterCard = {
  id: "OP10-095",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 6000,
  traits: ["Straw Hat Crew Supernovas Dressrosa"],
  attribute: "slash",
  effect:
    '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards: K.O. up to 1 of your opponent\'s Characters with a cost of 4 or less. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "leader",
              },
              {
                filter: "cardCategory",
                value: "stage",
              },
            ],
          },
        ],
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
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10RoronoaZoro095I18n,
};
