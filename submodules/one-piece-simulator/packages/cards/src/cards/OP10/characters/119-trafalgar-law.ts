import type { CharacterCard } from "@tcg/op-types";
import { op10TrafalgarLaw119I18n } from "./119-trafalgar-law.i18n.ts";

export const op10TrafalgarLaw119: CharacterCard = {
  id: "OP10-119",
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "OP10",
  cost: 7,
  power: 9000,
  traits: ["Heart Pirates Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-119_p2.jpg",
      imageId: "OP10-119_p2",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-119_p1.jpg",
      imageId: "OP10-119_p1",
    },
  ],
  effect:
    '[On Play] Reveal up to 1 "Supernovas" type Character card from your hand and add it to the top of your Life cards face-down. Then, give up to 1 rested DON!! card to 1 of your "Supernovas" type Leader.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Supernovas",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op10TrafalgarLaw119I18n,
};
