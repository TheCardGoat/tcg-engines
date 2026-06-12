import type { EventCard } from "@tcg/op-types";
import { op14eb04DonTWorryIMHere057I18n } from "./057-don-t-worry-i-m-here.i18n.ts";

export const op14eb04DonTWorryIMHere057: EventCard = {
  id: "OP14-057",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  trigger: "Draw 2 cards.",
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  effect:
    "[Main] All of your {Fish-Man} or {Merfolk} type Leader and Character cards gain +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04DonTWorryIMHere057I18n,
};
