import type { CharacterCard } from "@tcg/op-types";
import { op05Baby5034I18n } from "./034-baby-5.i18n.ts";

export const op05Baby5034: CharacterCard = {
  id: "OP05-034",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-034_p1.jpg",
      imageId: "OP05-034_p1",
    },
  ],
  effect:
    "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Look at 5 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
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
                value: "Donquixote Pirates",
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
  i18n: op05Baby5034I18n,
};
