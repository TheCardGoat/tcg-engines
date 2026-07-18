import type { CharacterCard } from "@tcg/op-types";
import { op05Shura106I18n } from "./106-shura.i18n.ts";

export const op05Shura106: CharacterCard = {
  id: "OP05-106",
  canonicalId: "OP05-106",
  slug: "shura",
  name: "Shura",
  printings: [
    {
      id: "OP05-106",
      artId: "OP05-106",
      setCode: "OP05",
      collectorNumber: "106",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-106.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "slash",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Sky Island] type card other than [Shura] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Play this card.",
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
                filter: "excludeName",
                value: "Shura",
              },
              {
                filter: "trait",
                value: "Sky Island",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op05Shura106I18n,
};
