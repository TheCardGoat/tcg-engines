import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Oinkchuck082I18n } from "./082-oinkchuck.i18n.ts";

export const op14eb04Oinkchuck082: CharacterCard = {
  id: "OP14-082",
  canonicalId: "OP14-082",
  slug: "oinkchuck/op14-082",
  name: "Oinkchuck",
  printings: [
    {
      id: "OP14-082",
      artId: "OP14-082",
      setCode: "OP14EB04",
      collectorNumber: "082",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-082_1s02PFT.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 2 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect:
    "[On K.O.] All of your {Thriller Bark Pirates} type Characters gain +4 cost until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Thriller Bark Pirates",
                  match: "includes",
                },
              ],
            },
            value: 4,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "trigger",
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
                value: "Thriller Bark Pirates",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Oinkchuck082I18n,
};
