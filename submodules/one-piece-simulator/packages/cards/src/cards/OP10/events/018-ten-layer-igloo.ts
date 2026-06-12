import type { EventCard } from "@tcg/op-types";
import { op10TenLayerIgloo018I18n } from "./018-ten-layer-igloo.i18n.ts";

export const op10TenLayerIgloo018: EventCard = {
  id: "OP10-018",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  traits: ["Donquixote Pirates Punk Hazard"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, give up to 1 of your opponent's Leader or Character cards 2000 power during this turn.",
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
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
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
    ],
  },
  i18n: op10TenLayerIgloo018I18n,
};
