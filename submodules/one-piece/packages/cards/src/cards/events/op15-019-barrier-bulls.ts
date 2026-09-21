import type { EventCard } from "@tcg/op-types";
import { op15BarrierBulls019I18n } from "./op15-019-barrier-bulls.i18n.ts";

export const op15BarrierBulls019: EventCard = {
  id: "OP15-019",
  canonicalId: "OP15-019",
  slug: "barrier-bulls/op15-019",
  name: "Barrier Bulls",
  printings: [
    {
      id: "OP15-019",
      artId: "OP15-019",
      setCode: "OP15",
      collectorNumber: "019",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-019_vyb0qon.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP15",
  cost: 3,
  traits: ["Dressrosa Barto Club"],
  effect:
    "[Main] Draw 1 card and your Leader gains +1000 power until the end of your opponent's next End Phase.[Trigger] Give up to 1 of your opponent's Characters -4000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op15BarrierBulls019I18n,
};
