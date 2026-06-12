import type { CharacterCard } from "@tcg/op-types";
import { prb01Baby5Op04032JollyRogerFoil032I18n } from "./032-baby-5-op04-032-jolly-roger-foil.i18n.ts";

export const prb01Baby5Op04032JollyRogerFoil032: CharacterCard = {
  id: "OP04-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-032_p3.jpg",
      imageId: "OP04-032_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-032_r1.jpg",
      imageId: "OP04-032_r1",
    },
  ],
  effect:
    "[End of Your Turn] You may trash this Character: Set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01Baby5Op04032JollyRogerFoil032I18n,
};
