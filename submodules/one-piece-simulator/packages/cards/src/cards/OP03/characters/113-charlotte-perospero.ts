import type { CharacterCard } from "@tcg/op-types";
import { op03CharlottePerospero113I18n } from "./113-charlotte-perospero.i18n.ts";

export const op03CharlottePerospero113: CharacterCard = {
  id: "OP03-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP03",
  cost: 3,
  power: 5000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-113_p1.jpg",
      imageId: "OP03-113_p1",
    },
  ],
  effect:
    "[On K.O.] Look at 3 cards from the top of your deck; reveal up to 1 [Big Mom Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                value: "Big Mom Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
        optional: true,
      },
    ],
  },
  i18n: op03CharlottePerospero113I18n,
};
