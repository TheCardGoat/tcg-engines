import type { EventCard } from "@tcg/op-types";
import { op07DragonBreath017I18n } from "./017-dragon-breath.i18n.ts";

export const op07DragonBreath017: EventCard = {
  id: "OP07-017",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP07",
  cost: 2,
  traits: ["Revolutionary Army"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with 3000 power or less and up to 1 of your opponent's Stages with a cost of 1 or less. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op07DragonBreath017I18n,
};
