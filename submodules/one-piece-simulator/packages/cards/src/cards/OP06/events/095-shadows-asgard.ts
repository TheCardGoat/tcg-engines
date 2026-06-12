import type { EventCard } from "@tcg/op-types";
import { op06ShadowsAsgard095I18n } from "./095-shadows-asgard.i18n.ts";

export const op06ShadowsAsgard095: EventCard = {
  id: "OP06-095",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 2,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  effect:
    "[Main] / [Counter] Your Leader gains +1000 power during this turn. Then, you may K.O. any number of your [Thriller Bark Pirates] type Characters with a cost of 2 or less. Your Leader gains an additional +1000 power during this turn for every Character K.O.'d.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op06ShadowsAsgard095I18n,
};
