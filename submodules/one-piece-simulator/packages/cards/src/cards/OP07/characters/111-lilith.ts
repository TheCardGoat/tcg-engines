import type { CharacterCard } from "@tcg/op-types";
import { op07Lilith111I18n } from "./111-lilith.i18n.ts";

export const op07Lilith111: CharacterCard = {
  id: "OP07-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP07",
  cost: 3,
  power: 5000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-111_p1.jpg",
      imageId: "OP07-111_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Egghead] type card other than [Lilith] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] If your Leader is [Vegapunk], play this card.",
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
                value: "Lilith",
              },
              {
                filter: "trait",
                value: "Egghead",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Vegapunk",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op07Lilith111I18n,
};
