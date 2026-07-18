import type { CharacterCard } from "@tcg/op-types";
import { op08Hamlet090I18n } from "./090-hamlet.i18n.ts";

export const op08Hamlet090: CharacterCard = {
  id: "OP08-090",
  canonicalId: "OP08-090",
  slug: "hamlet/op08-090",
  name: "Hamlet",
  printings: [
    {
      id: "OP08-090",
      artId: "OP08-090",
      setCode: "OP08",
      collectorNumber: "090",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-090.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "slash",
  effect:
    "[On Play] Play up to 1 [SMILE] type Character card with a cost of 2 or less from your trash.",
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
                value: 2,
              },
              {
                filter: "trait",
                value: "SMILE",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op08Hamlet090I18n,
};
