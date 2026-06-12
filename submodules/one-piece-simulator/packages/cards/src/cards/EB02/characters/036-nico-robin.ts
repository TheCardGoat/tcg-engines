import type { CharacterCard } from "@tcg/op-types";
import { eb02NicoRobin036I18n } from "./036-nico-robin.i18n.ts";

export const eb02NicoRobin036: CharacterCard = {
  id: "EB02-036",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB02",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-036_p1.png",
      imageId: "EB02-036_p1",
    },
  ],
  effect:
    '[Blocker]\n[On K.O.] DON!! 1: Look at 3 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    keywords: ["blocker"],
    effects: [
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
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb02NicoRobin036I18n,
};
