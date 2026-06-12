import type { CharacterCard } from "@tcg/op-types";
import { eb02Sogeking024I18n } from "./024-sogeking.i18n.ts";

export const eb02Sogeking024: CharacterCard = {
  id: "EB02-024",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Sniper Island"],
  attribute: "ranged",
  effect:
    "Also treat this card's name as [Usopp] according to the rules.\n[On Play] Draw 2 cards and place 2 cards from your hand at the bottom of your deck in any order. Then, return up to 1 Character with a cost of 1 or less to the owner's hand.",
  effects: {
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
            position: "bottom",
          },
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb02Sogeking024I18n,
};
