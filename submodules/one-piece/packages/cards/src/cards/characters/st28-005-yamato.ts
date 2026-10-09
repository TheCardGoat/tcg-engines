import type { CharacterCard } from "@tcg/op-types";
import { st28Yamato005I18n } from "./st28-005-yamato.i18n.ts";
export const st28Yamato005: CharacterCard = {
  id: "ST28-005",
  canonicalId: "ST28-005",
  slug: "yamato/st28-005",
  name: "Yamato",
  printings: [
    {
      id: "ST28-005",
      artId: "ST28-005",
      setCode: "ST28",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST28-005.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST28",
  cost: 1,
  traits: ["Land of Wano"],
  power: 0,
  attribute: "strike",
  counter: 1000,
  effect:
    "[DON!! x2] [Your Turn] This Character gains +3000 power. [On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Land of Wano} type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Land of Wano",
                match: "exact",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "your",
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
              },
              self: true,
            },
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st28Yamato005I18n,
};
