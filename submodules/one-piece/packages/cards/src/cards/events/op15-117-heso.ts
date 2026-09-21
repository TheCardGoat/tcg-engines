import type { EventCard } from "@tcg/op-types";
import { op15Heso117I18n } from "./op15-117-heso.i18n.ts";

export const op15Heso117: EventCard = {
  id: "OP15-117",
  canonicalId: "OP15-117",
  slug: "heso/op15-117",
  name: "Heso!!",
  printings: [
    {
      id: "OP15-117",
      artId: "OP15-117",
      setCode: "OP15",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-117_VaI6rE3.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP15",
  cost: 1,
  trigger: "If your Leader has the {Sky Island} type, draw 2 cards.",
  traits: ["Sky Island"],
  effect:
    "[Main] Draw 1 card. Then, give up to 1 rested DON!! card to 1 of your {Sky Island} type Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Sky Island",
                  match: "includes",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Sky Island",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op15Heso117I18n,
};
