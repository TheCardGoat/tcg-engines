import type { CharacterCard } from "@tcg/op-types";
import { op06Wyper114I18n } from "./114-wyper.i18n.ts";

export const op06Wyper114: CharacterCard = {
  id: "OP06-114",
  canonicalId: "OP06-114",
  slug: "wyper/op06-114",
  name: "Wyper",
  printings: [
    {
      id: "OP06-114",
      artId: "OP06-114",
      setCode: "OP06",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-114.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 7000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  effect:
    "[On Play] You may place 1 Stage with a cost of 1 at the bottom of the owner's deck: Look at 5 cards from the top of your deck; reveal up to 1 [Upper Yard] or [Shandian Warrior] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Upper Yard",
              },
              {
                filter: "trait",
                value: "Shandian Warrior",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06Wyper114I18n,
};
