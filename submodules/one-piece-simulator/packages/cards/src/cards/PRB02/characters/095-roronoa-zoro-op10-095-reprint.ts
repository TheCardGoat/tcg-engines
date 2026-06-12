import type { CharacterCard } from "@tcg/op-types";
import { prb02RoronoaZoroOp10095Reprint095I18n } from "./095-roronoa-zoro-op10-095-reprint.i18n.ts";

export const prb02RoronoaZoroOp10095Reprint095: CharacterCard = {
  id: "OP10-095",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 6000,
  traits: ["Straw Hat Crew Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095_p1.jpg",
      imageId: "OP10-095_p1",
    },
  ],
  effect:
    '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards: K.O. up to 1 of your opponent\'s Characters with a cost of 4 or less. Then, trash 2 cards from the top of your deck.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
  i18n: prb02RoronoaZoroOp10095Reprint095I18n,
};
