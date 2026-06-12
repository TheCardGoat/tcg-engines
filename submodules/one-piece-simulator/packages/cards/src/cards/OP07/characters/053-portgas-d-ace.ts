import type { CharacterCard } from "@tcg/op-types";
import { op07PortgasDAce053I18n } from "./053-portgas-d-ace.i18n.ts";

export const op07PortgasDAce053: CharacterCard = {
  id: "OP07-053",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Draw 2 cards and place 2 cards from your hand at the top or bottom of your deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "any",
          },
        ],
      },
    ],
  },
  i18n: op07PortgasDAce053I18n,
};
