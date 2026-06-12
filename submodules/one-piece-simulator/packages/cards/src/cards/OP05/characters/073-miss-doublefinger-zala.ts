import type { CharacterCard } from "@tcg/op-types";
import { op05MissDoublefingerZala073I18n } from "./073-miss-doublefinger-zala.i18n.ts";

export const op05MissDoublefingerZala073: CharacterCard = {
  id: "OP05-073",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP05",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
  i18n: op05MissDoublefingerZala073I18n,
};
