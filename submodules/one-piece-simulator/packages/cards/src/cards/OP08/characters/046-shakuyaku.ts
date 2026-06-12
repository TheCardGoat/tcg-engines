import type { CharacterCard } from "@tcg/op-types";
import { op08Shakuyaku046I18n } from "./046-shakuyaku.i18n.ts";

export const op08Shakuyaku046: CharacterCard = {
  id: "OP08-046",
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
        conditions: [
          {
            condition: "turn",
            value: "your",
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
