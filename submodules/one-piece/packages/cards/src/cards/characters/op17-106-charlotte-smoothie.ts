import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteSmoothie106I18n } from "./op17-106-charlotte-smoothie.i18n.ts";

export const op17CharlotteSmoothie106: CharacterCard = {
  id: "OP17-106",
  canonicalId: "OP17-106",
  slug: "charlotte-smoothie/op17-106",
  name: "Charlotte Smoothie",
  printings: [
    {
      id: "OP17-106",
      artId: "OP17-106",
      setCode: "OP17",
      collectorNumber: "106",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-106_sZf6dmu.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 5,
  power: 4000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Your Turn] [On Play] You may rest 2 of your DON!! cards: Add up to 1 card from the top of your deck to the top of your Life cards. Then, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op17CharlotteSmoothie106I18n,
};
