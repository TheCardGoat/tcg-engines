import type { CharacterCard } from "@tcg/op-types";
import { prb01VergoJollyRogerFoil079I18n } from "./079-vergo-jolly-roger-foil.i18n.ts";

export const prb01VergoJollyRogerFoil079: CharacterCard = {
  id: "OP03-079",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "PRB01",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_p4.jpg",
      imageId: "OP03-079_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-079_r2.jpg",
      imageId: "OP03-079_r2",
    },
  ],
  effect: "[DON!! x1] This Character cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: prb01VergoJollyRogerFoil079I18n,
};
