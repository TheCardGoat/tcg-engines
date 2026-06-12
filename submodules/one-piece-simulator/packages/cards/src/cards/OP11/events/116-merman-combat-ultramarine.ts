import type { EventCard } from "@tcg/op-types";
import { op11MermanCombatUltramarine116I18n } from "./116-merman-combat-ultramarine.i18n.ts";

export const op11MermanCombatUltramarine116: EventCard = {
  id: "OP11-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  trigger:
    "Add up to 1 of your opponent's Characters with a cost of 4 or less to the top or bottom of the owner's Life cards face-up.",
  traits: ["Merfolk Fish-Man Island"],
  effect:
    "[Main] Add up to 1 Character with a cost of 6 or less to the top or bottom of the owner's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: op11MermanCombatUltramarine116I18n,
};
