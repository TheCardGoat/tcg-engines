import type { EventCard } from "@tcg/op-types";
import { op11VagabondDrill039I18n } from "./039-vagabond-drill.i18n.ts";

export const op11VagabondDrill039: EventCard = {
  id: "OP11-039",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  effect:
    '[Counter] Up to 1 of your "Fish-Man" or "Merfolk" type Leader or Character cards gains +3000 power during this battle. Then, rest up to 1 of your opponent\'s Characters with a cost of 3 or less.',
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
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
                {
                  filter: "trait",
                  value: "Merfolk",
                },
              ],
            },
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11VagabondDrill039I18n,
};
