import type { CharacterCard } from "@tcg/op-types";
import { op08TonyTonyChopper007I18n } from "./007-tony-tony-chopper.i18n.ts";

export const op08TonyTonyChopper007: CharacterCard = {
  id: "OP08-007",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP08",
  cost: 3,
  power: 5000,
  traits: ["Animal Straw Hat Crew Drum Kingdom"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-007_p1.jpg",
      imageId: "OP08-007_p1",
    },
  ],
  effect:
    "[Your Turn] [On Play]/[When Attacking] Look at 5 cards from the top of your deck and play up to 1 [Animal] type Character card with 4000 power or less rested. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
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
                value: "Animal",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
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
                value: "Animal",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op08TonyTonyChopper007I18n,
};
