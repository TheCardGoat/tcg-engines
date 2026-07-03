import type { CharacterCard } from "@tcg/op-types";
import { op05Viola079I18n } from "./079-viola.i18n.ts";

export const op05Viola079: CharacterCard = {
  id: "OP05-079",
  canonicalId: "OP05-079",
  slug: "viola/op05-079",
  name: "Viola",
  printings: [
    {
      id: "OP05-079",
      artId: "OP05-079",
      setCode: "OP05",
      collectorNumber: "079",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-079.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP05",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "special",
  effect:
    "[On Play] Your opponent places 3 cards from their trash at the bottom of their deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["trash"],
              count: {
                amount: 3,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05Viola079I18n,
};
