import type { EventCard } from "@tcg/op-types";
import { op14eb04GroundDeath096I18n } from "./096-ground-death.i18n.ts";

export const op14eb04GroundDeath096: EventCard = {
  id: "OP14-096",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-096_p1_jXSvtE4.jpg",
      imageId: "OP14-096_p1",
    },
  ],
  effect:
    "[Main] You may rest 2 of your DON!! cards: Negate the effect of up to 1 of your opponent's Characters with a cost of 5 or less during this turn.\n[Counter] If you have 10 or more cards in your trash, up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "negateEffects",
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
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 10,
          },
        ],
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
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04GroundDeath096I18n,
};
