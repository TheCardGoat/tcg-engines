import type { CharacterCard } from "@tcg/op-types";
import { eb02Brook048I18n } from "./048-brook.i18n.ts";

export const eb02Brook048: CharacterCard = {
  id: "EB02-048",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-048_p1.png",
      imageId: "EB02-048_p1",
    },
  ],
  effect:
    "[On Play] Add up to 1 [Laboon] from your trash to your hand.\n[On K.O.] Play up to 1 [Laboon] with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Laboon",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onKo",
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
                value: 4,
              },
              {
                filter: "name",
                value: "Laboon",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02Brook048I18n,
};
