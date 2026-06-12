import type { EventCard } from "@tcg/op-types";
import { op08ItSToDieFor076I18n } from "./076-it-s-to-die-for.i18n.ts";

export const op08ItSToDieFor076: EventCard = {
  id: "OP08-076",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP08",
  cost: 3,
  traits: ["The Four Emperors Big Mom Pirates"],
  effect:
    "[Main] Add up to 1 DON!! card from your DON!! deck and set it as active. Then, if your opponent has a Character with 6000 power or more, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
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
  i18n: op08ItSToDieFor076I18n,
};
