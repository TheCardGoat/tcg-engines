import type { CharacterCard } from "@tcg/op-types";
import { op16Jozu007I18n } from "./op16-007-jozu.i18n.ts";

export const op16Jozu007: CharacterCard = {
  id: "OP16-007",
  canonicalId: "OP16-007",
  slug: "jozu/op16-007",
  name: "Jozu",
  printings: [
    {
      id: "OP16-007",
      artId: "OP16-007",
      setCode: "OP16",
      collectorNumber: "007",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-007_32LcgNx.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP16",
  cost: 7,
  power: 8000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[Blocker]\n\n[On Play] You may reveal 1 Character card with 8000 power from your hand: Give up to 1 of your opponent's Characters -1000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "revealFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16Jozu007I18n,
};
