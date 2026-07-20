import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Usopp022I18n } from "./022-usopp.i18n.ts";

export const op14eb04Usopp022: CharacterCard = {
  id: "OP14-022",
  canonicalId: "OP14-022",
  slug: "usopp/op14-022",
  name: "Usopp",
  printings: [
    {
      id: "OP14-022",
      artId: "OP14-022",
      setCode: "OP14EB04",
      collectorNumber: "022",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-022_aH2rLrv.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["FILM", "Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[End of Your Turn] If your Leader has the {FILM} or {Straw Hat Crew} type, set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "FILM",
                match: "includes",
              },
              {
                condition: "leaderTrait",
                trait: "Straw Hat Crew",
                match: "includes",
              },
            ],
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
      },
    ],
  },
  i18n: op14eb04Usopp022I18n,
};
