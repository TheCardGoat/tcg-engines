import type { CharacterCard } from "@tcg/op-types";
import { op11Kujyaku004I18n } from "./004-kujyaku.i18n.ts";

export const op11Kujyaku004: CharacterCard = {
  id: "OP11-004",
  canonicalId: "OP11-004",
  slug: "kujyaku/op11-004",
  name: "Kujyaku",
  printings: [
    {
      id: "OP11-004",
      artId: "OP11-004",
      setCode: "OP11",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-004.jpg",
    },
    {
      id: "OP11-004_p1",
      artId: "OP11-004_p1",
      setCode: "OP11",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-004_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP11",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Navy SWORD"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-004_p1.jpg",
      imageId: "OP11-004_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Navy" type card other than "Kujyaku" and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Activate: Main] You may trash this Character: Up to 1 of your Characters gains +1000 power during this turn.',
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
                value: "Kujyaku",
              },
              {
                filter: "trait",
                value: "Navy",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Kujyaku004I18n,
};
