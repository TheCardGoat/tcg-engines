import type { CharacterCard } from "@tcg/op-types";
import { op06LilyCarnation015I18n } from "./015-lily-carnation.i18n.ts";

export const op06LilyCarnation015: CharacterCard = {
  id: "OP06-015",
  canonicalId: "OP06-015",
  slug: "lily-carnation",
  name: "Lily Carnation",
  printings: [
    {
      id: "OP06-015",
      artId: "OP06-015",
      setCode: "OP06",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-015.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["FILM", "Omatsuri Island"],
  attribute: "special",
  effect:
    "[Activate:Main][Once Per Turn] You may trash 1 of your Characters with 6000 power or more: Play up to 1 [FILM] type Character card with 2000 to 5000 power from your trash rested.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashCharacter",
            amount: 1,
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 6000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "trait",
                value: "FILM",
                match: "includes",
              },
              {
                filter: "power",
                comparison: "gte",
                value: 2000,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06LilyCarnation015I18n,
};
