import type { CharacterCard } from "@tcg/op-types";
import { op16Tsuru067I18n } from "./op16-067-tsuru.i18n.ts";

export const op16Tsuru067: CharacterCard = {
  id: "OP16-067",
  canonicalId: "OP16-067",
  slug: "tsuru/op16-067",
  name: "Tsuru",
  printings: [
    {
      id: "OP16-067",
      artId: "OP16-067",
      setCode: "OP16",
      collectorNumber: "067",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-067_1NGQGA1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Navy} type card, add it to your hand and place the rest at the bottom of your deck in any order. Then, trash 1 card from your hand.",
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
                value: "Navy",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op16Tsuru067I18n,
};
