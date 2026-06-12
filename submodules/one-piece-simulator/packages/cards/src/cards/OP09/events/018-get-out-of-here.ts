import type { EventCard } from "@tcg/op-types";
import { op09GetOutOfHere018I18n } from "./018-get-out-of-here.i18n.ts";

export const op09GetOutOfHere018: EventCard = {
  id: "OP09-018",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  traits: ["Red-Haired Pirates"],
  effect: "[Main] K.O. up to 2 of your opponent's Characters with a total power of 4000 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              totalConstraint: {
                property: "power",
                comparison: "lte",
                value: 4000,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op09GetOutOfHere018I18n,
};
