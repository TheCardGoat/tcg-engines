import type { EventCard } from "@tcg/op-types";
import { op03TropicalTorment120I18n } from "./120-tropical-torment.i18n.ts";

export const op03TropicalTorment120: EventCard = {
  id: "OP03-120",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  traits: ["Big Mom Pirates"],
  effect:
    "[Main] If your opponent has 4 or more Life cards, trash up to 1 card from the top of your opponent's Life cards. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "gte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
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
  i18n: op03TropicalTorment120I18n,
};
