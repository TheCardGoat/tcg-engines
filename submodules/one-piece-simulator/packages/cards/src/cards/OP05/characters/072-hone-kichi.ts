import type { CharacterCard } from "@tcg/op-types";
import { op05HoneKichi072I18n } from "./072-hone-kichi.i18n.ts";

export const op05HoneKichi072: CharacterCard = {
  id: "OP05-072",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 6000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[On Play] If you have 8 or more DON!! cards on your field, give up to 2 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op05HoneKichi072I18n,
};
