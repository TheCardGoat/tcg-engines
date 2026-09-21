import type { CharacterCard } from "@tcg/op-types";
import { prb01BartolomeoP029JollyRogerFoil029I18n } from "./p-029-bartolomeo-p-029-jolly-roger-foil.i18n.ts";

export const prb01BartolomeoP029JollyRogerFoil029: CharacterCard = {
  id: "P-029",
  canonicalId: "P-029",
  slug: "bartolomeo-p-029-jolly-roger-foil",
  name: "Bartolomeo",
  printings: [
    {
      id: "P-029",
      artId: "P-029",
      setCode: "P",
      collectorNumber: "029",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-029_p3.jpg",
      label: "Bartolomeo (P-029) (Jolly Roger Foil)",
    },
    {
      id: "P-029_p4",
      artId: "P-029_p4",
      setCode: "P",
      collectorNumber: "029",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-029_p4.jpg",
      label: "Bartolomeo (P-029) (Full Art)",
    },
    {
      id: "P-029_r2",
      artId: "P-029_r2",
      setCode: "P",
      collectorNumber: "029",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-029_r2.jpg",
      label: "Bartolomeo (P-029) (Reprint)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Barto Club Pirates Supernovas"],
  attribute: "special",
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
                  match: "includes",
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
