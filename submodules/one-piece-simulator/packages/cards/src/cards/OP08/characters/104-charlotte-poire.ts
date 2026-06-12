import type { CharacterCard } from "@tcg/op-types";
import { op08CharlottePoire104I18n } from "./104-charlotte-poire.i18n.ts";

export const op08CharlottePoire104: CharacterCard = {
  id: "OP08-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  trigger: "You may trash 1 card from your hand: Play this card. Then, draw 1 card.",
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect: "[Trigger] You may trash 1 card from your hand: Play this card. Then, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
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
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08CharlottePoire104I18n,
};
