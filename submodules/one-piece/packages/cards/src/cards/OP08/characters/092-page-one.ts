import type { CharacterCard } from "@tcg/op-types";
import { op08PageOne092I18n } from "./092-page-one.i18n.ts";

export const op08PageOne092: CharacterCard = {
  id: "OP08-092",
  canonicalId: "OP08-092",
  slug: "page-one/op08-092",
  name: "Page One",
  printings: [
    {
      id: "OP08-092",
      artId: "OP08-092",
      setCode: "OP08",
      collectorNumber: "092",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-092.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP08",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect: "[On Play] Play up to 1 [Ulti] with a cost of 4 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
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
                value: "Ulti",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op08PageOne092I18n,
};
