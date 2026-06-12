import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Vista053I18n } from "./053-vista.i18n.ts";

export const op14eb04Vista053: CharacterCard = {
  id: "OP14-053",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Blocker]\n[Opponent's Turn] If you have 7 or less cards in your hand, this Character's base power becomes the same as your Leader's base power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "setPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Vista053I18n,
};
