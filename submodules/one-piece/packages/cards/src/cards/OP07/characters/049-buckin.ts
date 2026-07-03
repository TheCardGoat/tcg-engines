import type { CharacterCard } from "@tcg/op-types";
import { op07Buckin049I18n } from "./049-buckin.i18n.ts";

export const op07Buckin049: CharacterCard = {
  id: "OP07-049",
  canonicalId: "OP07-049",
  slug: "buckin/op07-049",
  name: "Buckin",
  printings: [
    {
      id: "OP07-049",
      artId: "OP07-049",
      setCode: "OP07",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-049.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 0,
  traits: ["Weevil's Mother"],
  attribute: "wisdom",
  effect: "[On Play] Play up to 1 [Edward Weevil] with a cost of 4 or less from your hand rested.",
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "name",
                value: "Edward Weevil",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07Buckin049I18n,
};
