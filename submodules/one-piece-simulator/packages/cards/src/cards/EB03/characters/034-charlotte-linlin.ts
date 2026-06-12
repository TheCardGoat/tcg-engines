import type { CharacterCard } from "@tcg/op-types";
import { eb03CharlotteLinlin034I18n } from "./034-charlotte-linlin.i18n.ts";

export const eb03CharlotteLinlin034: CharacterCard = {
  id: "EB03-034",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB03",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-034_p1_56maI5N.jpg",
      imageId: "EB03-034_p1",
    },
  ],
  effect:
    "[On Play] Draw 1 card and place 1 card from your hand at the top of your deck. Then, add up to 1 DON!! card from your DON!! deck and set it as active.\n[On K.O.] DON!! 1: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "top",
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "onKo",
        costs: [
          {
            cost: "returnDon",
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
        ],
      },
    ],
  },
  i18n: eb03CharlotteLinlin034I18n,
};
