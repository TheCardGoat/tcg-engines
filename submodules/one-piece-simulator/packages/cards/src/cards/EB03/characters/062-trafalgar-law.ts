import type { CharacterCard } from "@tcg/op-types";
import { eb03TrafalgarLaw062I18n } from "./062-trafalgar-law.i18n.ts";

export const eb03TrafalgarLaw062: CharacterCard = {
  id: "EB03-062",
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "EB03",
  cost: 8,
  power: 6000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-062_p1_rVGeO4S.jpg",
      imageId: "EB03-062_p1",
    },
  ],
  effect:
    "[Rush] [Activate: Main] You may trash 1 card from your hand and trash this Character: Add up to 1 card from the top of your deck to the top of your Life cards. Then, play up to 1 [Trafalgar Law] with a cost of 7 or less from your hand.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
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
                value: 7,
              },
              {
                filter: "name",
                value: "Trafalgar Law",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03TrafalgarLaw062I18n,
};
