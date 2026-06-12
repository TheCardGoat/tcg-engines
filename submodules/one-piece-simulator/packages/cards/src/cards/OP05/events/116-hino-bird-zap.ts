import type { EventCard } from "@tcg/op-types";
import { op05HinoBirdZap116I18n } from "./116-hino-bird-zap.i18n.ts";

export const op05HinoBirdZap116: EventCard = {
  id: "OP05-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  traits: ["Sky Island"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards. [Trigger] Activate this card's [Main] effect.",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
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
  i18n: op05HinoBirdZap116I18n,
};
