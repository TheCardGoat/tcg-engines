import type { EventCard } from "@tcg/op-types";
import { op01DesertSpada088I18n } from "./088-desert-spada.i18n.ts";

export const op01DesertSpada088: EventCard = {
  id: "OP01-088",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order.  This card has been officially errata'd.",
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op01DesertSpada088I18n,
};
