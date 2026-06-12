import type { EventCard } from "@tcg/op-types";
import { op01BeBeng059I18n } from "./059-be-beng.i18n.ts";

export const op01BeBeng059: EventCard = {
  id: "OP01-059",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  traits: ["Land of Wano"],
  effect:
    '[Main] You may trash 1 "Land of Wano" type card from your hand: Set up to 1 of your "Land of Wano" type Character cards with a cost of 3 or less as active.  This card has been officially errata\'d.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "setActive",
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
                  value: "Land of Wano",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01BeBeng059I18n,
};
