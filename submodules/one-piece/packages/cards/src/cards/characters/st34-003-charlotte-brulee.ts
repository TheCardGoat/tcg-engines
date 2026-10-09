import type { CharacterCard } from "@tcg/op-types";
import { st34CharlotteBrulee003I18n } from "./st34-003-charlotte-brulee.i18n.ts";
export const st34CharlotteBrulee003: CharacterCard = {
  id: "ST34-003",
  canonicalId: "ST34-003",
  slug: "charlotte-brulee/st34-003",
  name: "Charlotte Brulee",
  printings: [
    {
      id: "ST34-003",
      artId: "ST34-003",
      setCode: "ST34",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST34-003.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST34",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Big Mom Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: "Big Mom Pirates",
                match: "exact",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: st34CharlotteBrulee003I18n,
};
