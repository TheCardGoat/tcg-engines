import type { CharacterCard } from "@tcg/op-types";
import { op14eb04GloriosaGrandmaNyon103I18n } from "./103-gloriosa-grandma-nyon.i18n.ts";

export const op14eb04GloriosaGrandmaNyon103: CharacterCard = {
  id: "OP14-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04GloriosaGrandmaNyon103I18n,
};
