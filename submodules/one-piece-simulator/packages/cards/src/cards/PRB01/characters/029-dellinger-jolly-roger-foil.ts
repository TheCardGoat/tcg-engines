import type { CharacterCard } from "@tcg/op-types";
import { prb01DellingerJollyRogerFoil029I18n } from "./029-dellinger-jolly-roger-foil.i18n.ts";

export const prb01DellingerJollyRogerFoil029: CharacterCard = {
  id: "OP04-029",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_p3.jpg",
      imageId: "OP04-029_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-029_r1.jpg",
      imageId: "OP04-029_r1",
    },
  ],
  effect: "[End of Your Turn] Set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: prb01DellingerJollyRogerFoil029I18n,
};
