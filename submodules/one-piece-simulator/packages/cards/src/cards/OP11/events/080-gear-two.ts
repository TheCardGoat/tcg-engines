import type { EventCard } from "@tcg/op-types";
import { op11GearTwo080I18n } from "./080-gear-two.i18n.ts";

export const op11GearTwo080: EventCard = {
  id: "OP11-080",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-080_p1.jpg",
      imageId: "OP11-080_p1",
    },
  ],
  effect:
    "[Main] You may rest 2 of your DON!! cards: If your Leader's colors include blue, add up to 1 DON!! card from your DON!! deck and rest it.\n[Counter] Up to 1 of your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderColor",
            color: "blue",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
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
  i18n: op11GearTwo080I18n,
};
