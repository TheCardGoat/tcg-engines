import type { EventCard } from "@tcg/op-types";
import { op04WeaknessIsAnUnforgivableSin076I18n } from "./076-weakness-is-an-unforgivable-sin.i18n.ts";

export const op04WeaknessIsAnUnforgivableSin076: EventCard = {
  id: "OP04-076",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  effect:
    "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader or Character cards gains +1000 power during this turn. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op04WeaknessIsAnUnforgivableSin076I18n,
};
