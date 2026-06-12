import type { CharacterCard } from "@tcg/op-types";
import { op01Kyoshirou095I18n } from "./095-kyoshirou.i18n.ts";

export const op01Kyoshirou095: CharacterCard = {
  id: "OP01-095",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "slash",
  effect: "[On Play] Draw 1 card if you have 8 or more DON!! cards on your field.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "donFieldCount",
              player: "self",
              comparison: "gte",
              value: 8,
            },
          },
        ],
      },
    ],
  },
  i18n: op01Kyoshirou095I18n,
};
