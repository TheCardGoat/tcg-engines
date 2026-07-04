import type { EventCard } from "@tcg/op-types";
import { op01RoundTable027I18n } from "./027-round-table.i18n.ts";

export const op01RoundTable027: EventCard = {
  id: "OP01-027",
  canonicalId: "OP01-027",
  slug: "round-table",
  name: "Round Table",
  printings: [
    {
      id: "OP01-027",
      artId: "OP01-027",
      setCode: "OP01",
      collectorNumber: "027",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-027.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  traits: ["Beautiful Pirates Supernovas"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -10000 power during this turn.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            value: -10000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op01RoundTable027I18n,
};
