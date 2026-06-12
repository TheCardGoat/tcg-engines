import type { EventCard } from "@tcg/op-types";
import { op07KeepOut018I18n } from "./018-keep-out.i18n.ts";

export const op07KeepOut018: EventCard = {
  id: "OP07-018",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  traits: ["Revolutionary Army Impel Down"],
  effect:
    "[Counter] Up to 1 of your [Revolutionary Army] type Characters gains +2000 power until the end of your next turn. [Trigger] Activate this card's [Counter] effect.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                },
              ],
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "counter",
          },
        ],
      },
    ],
  },
  i18n: op07KeepOut018I18n,
};
