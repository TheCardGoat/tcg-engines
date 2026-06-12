import type { CharacterCard } from "@tcg/op-types";
import { op03Hatchan033I18n } from "./033-hatchan.i18n.ts";

export const op03Hatchan033: CharacterCard = {
  id: "OP03-033",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 4000,
  counter: 2000,
  trigger: "If your Leader has the [East Blue] type, play this card.",
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "slash",
  effect: "[Trigger] If your Leader has the [East Blue] type, play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "East Blue",
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
  i18n: op03Hatchan033I18n,
};
