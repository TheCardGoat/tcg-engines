import type { EventCard } from "@tcg/op-types";
import { prb01JudgmentOfHellJollyRogerFoil089I18n } from "./089-judgment-of-hell-jolly-roger-foil.i18n.ts";

export const prb01JudgmentOfHellJollyRogerFoil089: EventCard = {
  id: "OP02-089",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "PRB01",
  cost: 2,
  traits: ["Impel Down"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p3.jpg",
      imageId: "OP02-089_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_r1.png",
      imageId: "OP02-089_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-089_p4.jpg",
      imageId: "OP02-089_p4",
    },
  ],
  effect:
    "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to a total of 2 of your opponent's Leader or Character cards -3000 power during this turn.[Trigger] If your opponent has 6 or more DON!! cards on their field, your opponent returns 1 DON!! card from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "opponentReturnDon",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb01JudgmentOfHellJollyRogerFoil089I18n,
};
