import type { CharacterCard } from "@tcg/op-types";
import { op05Conis104I18n } from "./104-conis.i18n.ts";

export const op05Conis104: CharacterCard = {
  id: "OP05-104",
  canonicalId: "OP05-104",
  slug: "conis/op05-104",
  name: "Conis",
  printings: [
    {
      id: "OP05-104",
      artId: "OP05-104",
      setCode: "OP05",
      collectorNumber: "104",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-104.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[On Play] You may place 1 of your Stages at the bottom of your deck: Draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["stage"],
              count: { amount: 1 },
            },
            position: "bottom",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Conis104I18n,
};
