import type { EventCard } from "@tcg/op-types";
import { op14eb04IceTime028I18n } from "./028-ice-time.i18n.ts";

export const op14eb04IceTime028: EventCard = {
  id: "EB04-028",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  traits: ["Navy"],
  effect:
    "[Main] You may trash 1 card from your hand: If your Leader has the {Navy} type, up to 2 of your opponent's Characters with 10000 power or less cannot attack until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 10000,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04IceTime028I18n,
};
