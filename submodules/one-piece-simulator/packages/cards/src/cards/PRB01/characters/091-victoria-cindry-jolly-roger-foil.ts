import type { CharacterCard } from "@tcg/op-types";
import { prb01VictoriaCindryJollyRogerFoil091I18n } from "./091-victoria-cindry-jolly-roger-foil.i18n.ts";

export const prb01VictoriaCindryJollyRogerFoil091: CharacterCard = {
  id: "OP06-091",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_p3.jpg",
      imageId: "OP06-091_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-091_r1.png",
      imageId: "OP06-091_r1",
    },
  ],
  effect:
    "[On Play] If your Leader has the [Thriller Bark Pirates] type, trash 5 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 5,
          },
        ],
      },
    ],
  },
  i18n: prb01VictoriaCindryJollyRogerFoil091I18n,
};
