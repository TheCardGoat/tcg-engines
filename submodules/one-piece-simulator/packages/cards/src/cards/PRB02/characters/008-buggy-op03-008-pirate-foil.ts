import type { CharacterCard } from "@tcg/op-types";
import { prb02BuggyOp03008PirateFoil008I18n } from "./008-buggy-op03-008-pirate-foil.i18n.ts";

export const prb02BuggyOp03008PirateFoil008: CharacterCard = {
  id: "OP03-008",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 1,
  power: 3000,
  traits: ["Buggy Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-008_r1.jpg",
      imageId: "OP03-008_r1",
    },
  ],
  effect:
    'This Character cannot be K.O.\'d in battle by "Slash" attribute cards.[On Play] Look at 5 cards from the top of your deck; reveal up to 1 red Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02BuggyOp03008PirateFoil008I18n,
};
