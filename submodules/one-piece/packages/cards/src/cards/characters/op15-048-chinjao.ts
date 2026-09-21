import type { CharacterCard } from "@tcg/op-types";
import { op15Chinjao048I18n } from "./op15-048-chinjao.i18n.ts";

export const op15Chinjao048: CharacterCard = {
  id: "OP15-048",
  canonicalId: "OP15-048",
  slug: "chinjao/op15-048",
  name: "Chinjao",
  printings: [
    {
      id: "OP15-048",
      artId: "OP15-048",
      setCode: "OP15",
      collectorNumber: "048",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-048_KoKrpp5.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Happosui Army Dressrosa"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 Event from your hand: Draw 2 cards.\n[Opponent's Turn] [On K.O.] Your opponent places 1 card from their hand at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op15Chinjao048I18n,
};
