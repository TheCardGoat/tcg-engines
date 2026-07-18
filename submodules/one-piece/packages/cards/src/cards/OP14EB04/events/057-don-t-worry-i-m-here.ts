import type { EventCard } from "@tcg/op-types";
import { op14eb04DonTWorryIMHere057I18n } from "./057-don-t-worry-i-m-here.i18n.ts";

export const op14eb04DonTWorryIMHere057: EventCard = {
  id: "OP14-057",
  canonicalId: "OP14-057",
  slug: "don-t-worry-i-m-here",
  name: "Don't Worry!! I'm Here!!",
  printings: [
    {
      id: "OP14-057",
      artId: "OP14-057",
      setCode: "OP14EB04",
      collectorNumber: "057",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-057_vxm7oHn.jpg",
    },
  ],
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
                  filter: "anyOf",
                  groups: [
                    [{ filter: "trait", value: "Fish-Man", match: "includes" }],
                    [{ filter: "trait", value: "Merfolk", match: "includes" }],
                  ],
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 2 }],
      },
    ],
  },
  i18n: op14eb04DonTWorryIMHere057I18n,
};
