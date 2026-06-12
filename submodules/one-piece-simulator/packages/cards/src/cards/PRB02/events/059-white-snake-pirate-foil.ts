import type { EventCard } from "@tcg/op-types";
import { prb02WhiteSnakePirateFoil059I18n } from "./059-white-snake-pirate-foil.i18n.ts";

export const prb02WhiteSnakePirateFoil059: EventCard = {
  id: "OP06-059",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "PRB02",
  cost: 2,
  traits: ["Navy"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-059_r1.jpg",
      imageId: "OP06-059_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this turn, and draw 1 card.[Trigger] Look at 5 cards from the top of your deck and place them at the top or bottom of your deck in any order.",
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
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: prb02WhiteSnakePirateFoil059I18n,
};
