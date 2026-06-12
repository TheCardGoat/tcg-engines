import type { CharacterCard } from "@tcg/op-types";
import { prb01Baby5Op05034JollyRogerFoil034I18n } from "./034-baby-5-op05-034-jolly-roger-foil.i18n.ts";

export const prb01Baby5Op05034JollyRogerFoil034: CharacterCard = {
  id: "OP05-034",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB01",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-034_r1.jpg",
      imageId: "OP05-034_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-034_p4.jpg",
      imageId: "OP05-034_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-034_p5.png",
      imageId: "OP05-034_p5",
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
  i18n: prb01Baby5Op05034JollyRogerFoil034I18n,
};
