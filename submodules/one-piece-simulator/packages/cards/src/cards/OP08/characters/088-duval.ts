import type { CharacterCard } from "@tcg/op-types";
import { op08Duval088I18n } from "./088-duval.i18n.ts";

export const op08Duval088: CharacterCard = {
  id: "OP08-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["The Flying Fish Riders"],
  attribute: "ranged",
  effect:
    "[On Play] Up to 1 of your Characters gains +1 cost until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op08Duval088I18n,
};
