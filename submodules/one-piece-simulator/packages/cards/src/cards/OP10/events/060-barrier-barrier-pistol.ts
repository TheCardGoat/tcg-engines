import type { EventCard } from "@tcg/op-types";
import { op10BarrierBarrierPistol060I18n } from "./060-barrier-barrier-pistol.i18n.ts";

export const op10BarrierBarrierPistol060: EventCard = {
  id: "OP10-060",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Dressrosa Barto Club"],
  effect:
    "[Main] Place up to 1 of your opponent's Characters with 6000 power or less at the bottom of the owner's deck.",
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
                  value: 6000,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10BarrierBarrierPistol060I18n,
};
