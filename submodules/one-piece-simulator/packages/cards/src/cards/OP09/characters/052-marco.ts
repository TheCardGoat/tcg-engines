import type { CharacterCard } from "@tcg/op-types";
import { op09Marco052I18n } from "./052-marco.i18n.ts";

export const op09Marco052: CharacterCard = {
  id: "OP09-052",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 5000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[Opponent's Turn] You may trash 1 card from your hand: When this Character is K.O.'d by your opponent's effect, play this Character card from your trash rested.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
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
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Marco052I18n,
};
