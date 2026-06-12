import type { CharacterCard } from "@tcg/op-types";
import { op03Kuroobi026I18n } from "./026-kuroobi.i18n.ts";

export const op03Kuroobi026: CharacterCard = {
  id: "OP03-026",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 3000,
  counter: 1000,
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the [East Blue] type, rest up to 1 of your opponent's Characters. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "East Blue",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
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
  i18n: op03Kuroobi026I18n,
};
