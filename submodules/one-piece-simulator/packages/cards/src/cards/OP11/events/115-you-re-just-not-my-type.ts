import type { EventCard } from "@tcg/op-types";
import { op11YouReJustNotMyType115I18n } from "./115-you-re-just-not-my-type.i18n.ts";

export const op11YouReJustNotMyType115: EventCard = {
  id: "OP11-115",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  traits: ["Merfolk Fish-Man Island"],
  effect:
    "[Counter] If your Leader is [Shirahoshi], up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderName",
            name: "Shirahoshi",
          },
        ],
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
  i18n: op11YouReJustNotMyType115I18n,
};
