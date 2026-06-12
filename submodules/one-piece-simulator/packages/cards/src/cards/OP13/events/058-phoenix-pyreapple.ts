import type { EventCard } from "@tcg/op-types";
import { op13PhoenixPyreapple058I18n } from "./058-phoenix-pyreapple.i18n.ts";

export const op13PhoenixPyreapple058: EventCard = {
  id: "OP13-058",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP13",
  cost: 1,
  traits: ["Former Whitebeard Pirates"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: Place up to 1 of your opponent's Characters with 3000 power or less at the bottom of the owner's deck.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op13PhoenixPyreapple058I18n,
};
