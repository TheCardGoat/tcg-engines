import type { CharacterCard } from "@tcg/op-types";
import { prb01BartolomeoP029JollyRogerFoil029I18n } from "./029-bartolomeo-p-029-jolly-roger-foil.i18n.ts";

export const prb01BartolomeoP029JollyRogerFoil029: CharacterCard = {
  id: "P-029",
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "PRB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Barto Club Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-029_p4.jpg",
      imageId: "P-029_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-029_r2.jpg",
      imageId: "P-029_r2",
    },
  ],
  effect:
    '[End of your Turn] You may rest this Character: Set up to 1 of your "FILM" type Characters other than [Bartolomeo] as active.',
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                },
                {
                  filter: "excludeName",
                  value: "Bartolomeo",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01BartolomeoP029JollyRogerFoil029I18n,
};
