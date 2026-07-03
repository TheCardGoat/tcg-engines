import type { CharacterCard } from "@tcg/op-types";
import { op09TrafalgarLaw030I18n } from "./030-trafalgar-law.i18n.ts";

export const op09TrafalgarLaw030: CharacterCard = {
  id: "OP09-030",
  canonicalId: "OP09-030",
  slug: "trafalgar-law/op09-030",
  name: "Trafalgar Law",
  printings: [
    {
      id: "OP09-030",
      artId: "OP09-030",
      setCode: "OP09",
      collectorNumber: "030",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-030.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Heart Pirates Supernovas ODYSSEY"],
  attribute: "slash",
  effect:
    '[On Play] You may return 1 of your Characters to the owner\'s hand: Play up to 1 "ODYSSEY" type Character card with a cost of 3 or less other than [Trafalgar Law] from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Trafalgar Law",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "ODYSSEY",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09TrafalgarLaw030I18n,
};
