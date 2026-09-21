import type { CharacterCard } from "@tcg/op-types";
import { op15Octoballoon106I18n } from "./op15-106-octoballoon.i18n.ts";

export const op15Octoballoon106: CharacterCard = {
  id: "OP15-106",
  canonicalId: "OP15-106",
  slug: "octoballoon/op15-106",
  name: "Octoballoon",
  printings: [
    {
      id: "OP15-106",
      artId: "OP15-106",
      setCode: "OP15",
      collectorNumber: "106",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-106_OMRP1T5.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP15",
  cost: 2,
  power: 0,
  counter: 1000,
  trigger:
    "Draw 1 card. Then, play up to 1 yellow Character or Stage card with a cost of 2 or less from your hand.",
  traits: ["Animal Sky Island"],
  attribute: "wisdom",
  effect:
    "[Trigger] Draw 1 card. Then, play up to 1 yellow Character or Stage card with a cost of 2 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "color",
                value: "yellow",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op15Octoballoon106I18n,
};
