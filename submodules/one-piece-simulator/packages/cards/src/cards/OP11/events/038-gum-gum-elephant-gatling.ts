import type { EventCard } from "@tcg/op-types";
import { op11GumGumElephantGatling038I18n } from "./038-gum-gum-elephant-gatling.i18n.ts";

export const op11GumGumElephantGatling038: EventCard = {
  id: "OP11-038",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  traits: ["Straw Hat Crew Supernovas Fish-Man Island"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: Rest up to 1 of your opponent's Characters with a cost of 5 or less.\n[Counter] Up to 1 of your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
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
                  value: 5,
                },
              ],
            },
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
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op11GumGumElephantGatling038I18n,
};
