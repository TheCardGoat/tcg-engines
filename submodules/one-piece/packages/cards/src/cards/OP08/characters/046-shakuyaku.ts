import type { CharacterCard } from "@tcg/op-types";
import { op08Shakuyaku046I18n } from "./046-shakuyaku.i18n.ts";

export const op08Shakuyaku046: CharacterCard = {
  id: "OP08-046",
  canonicalId: "OP08-046",
  slug: "shakuyaku/op08-046",
  name: "Shakuyaku",
  printings: [
    {
      id: "OP08-046",
      artId: "OP08-046",
      setCode: "OP08",
      collectorNumber: "046",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-046.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[Your Turn] [Once Per Turn] When a Character is removed from the field by your effect, if your opponent has 5 or more cards in their hand, your opponent places 1 card from their hand at the bottom of their deck. Then, rest this Character.",
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        source: "effect",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
          },
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08Shakuyaku046I18n,
};
