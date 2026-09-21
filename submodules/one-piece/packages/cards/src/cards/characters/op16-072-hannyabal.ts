import type { CharacterCard } from "@tcg/op-types";
import { op16Hannyabal072I18n } from "./op16-072-hannyabal.i18n.ts";

export const op16Hannyabal072: CharacterCard = {
  id: "OP16-072",
  canonicalId: "OP16-072",
  slug: "hannyabal/op16-072",
  name: "Hannyabal",
  printings: [
    {
      id: "OP16-072",
      artId: "OP16-072",
      setCode: "OP16",
      collectorNumber: "072",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-072_iHlIxeG.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP16",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Impel Down} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
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
                value: "Impel Down",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op16Hannyabal072I18n,
};
