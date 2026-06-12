import type { CharacterCard } from "@tcg/op-types";
import { op11Pappag109I18n } from "./109-pappag.i18n.ts";

export const op11Pappag109: CharacterCard = {
  id: "OP11-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Animal Fish-Man Island"],
  attribute: "wisdom",
  effect: "[On Play] If you have [Camie], draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Camie",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op11Pappag109I18n,
};
