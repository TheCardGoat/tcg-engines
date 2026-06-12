import type { CharacterCard } from "@tcg/op-types";
import { op14eb04DrHogback110I18n } from "./110-dr-hogback.i18n.ts";

export const op14eb04DrHogback110: CharacterCard = {
  id: "OP14-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "wisdom",
  effect:
    "[On K.O.] Play up to 1 Character card with a cost of 4 or less and a [Trigger] other than [Dr. Hogback] from your trash.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                filter: "excludeName",
                value: "Dr. Hogback",
              },
              {
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
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
  i18n: op14eb04DrHogback110I18n,
};
