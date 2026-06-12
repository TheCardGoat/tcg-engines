import type { EventCard } from "@tcg/op-types";
import { op05DragonClaw095I18n } from "./095-dragon-claw.i18n.ts";

export const op05DragonClaw095: EventCard = {
  id: "OP05-095",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  traits: ["Revolutionary Army Dressrosa"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 15 or more cards in your trash, K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op05DragonClaw095I18n,
};
