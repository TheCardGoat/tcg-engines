import type { CharacterCard } from "@tcg/op-types";
import { prb01KouzukiMomonosukeJollyRogerFoil041I18n } from "./041-kouzuki-momonosuke-jolly-roger-foil.i18n.ts";

export const prb01KouzukiMomonosukeJollyRogerFoil041: CharacterCard = {
  id: "OP01-041",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB01",
  cost: 1,
  power: 0,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_p5.jpg",
      imageId: "OP01-041_p5",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_r1.png",
      imageId: "OP01-041_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-041_p5_BTppBsS.jpg",
      imageId: "OP01-041_p5",
    },
  ],
  effect:
    '[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area) You may rest this Character: Look at 5 cards from the top of your deck; reveal up to 1 "Land of Wano" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.This card has been officially errata\'d.',
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
                value: "Land of Wano",
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
  i18n: prb01KouzukiMomonosukeJollyRogerFoil041I18n,
};
