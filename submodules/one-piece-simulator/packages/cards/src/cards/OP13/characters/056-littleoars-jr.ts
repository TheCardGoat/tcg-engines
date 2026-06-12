import type { CharacterCard } from "@tcg/op-types";
import { op13LittleoarsJr056I18n } from "./056-littleoars-jr.i18n.ts";

export const op13LittleoarsJr056: CharacterCard = {
  id: "OP13-056",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Giant Whitebeard Pirates Allies"],
  attribute: "strike",
  effect: '[When Attacking] If your Leader\'s type includes "Whitebeard Pirates", draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13LittleoarsJr056I18n,
};
