import type { EventCard } from "@tcg/op-types";
import { op04FlappingThread037I18n } from "./037-flapping-thread.i18n.ts";

export const op04FlappingThread037: EventCard = {
  id: "OP04-037",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] If your Leader has the [Donquixote Pirates] type, up to 1 of your Leader or Character cards gains +2000 power during this turn. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04FlappingThread037I18n,
};
