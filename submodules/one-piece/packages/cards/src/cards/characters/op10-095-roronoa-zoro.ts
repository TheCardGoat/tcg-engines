import type { CharacterCard } from "@tcg/op-types";
import { op10RoronoaZoro095I18n } from "./op10-095-roronoa-zoro.i18n.ts";

export const op10RoronoaZoro095: CharacterCard = {
  id: "OP10-095",
  canonicalId: "OP10-095",
  slug: "roronoa-zoro/op10-095",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP10-095",
      artId: "OP10-095",
      setCode: "OP10",
      collectorNumber: "095",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095.jpg",
    },
    {
      id: "OP10-095_p1",
      artId: "OP10-095_p1",
      setCode: "OP10",
      collectorNumber: "095",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095_p1.jpg",
      label: "Roronoa Zoro - OP10-095 (Alternate Art)",
    },
    {
      id: "OP10-095_r1",
      artId: "OP10-095_r1",
      setCode: "OP10",
      collectorNumber: "095",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095_r1.jpg",
    },
  ],
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
                match: "includes",
              },
              {
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "cardCategory",
                      value: "leader",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "stage",
                    },
                  ],
                ],
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
