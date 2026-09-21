import type { CharacterCard } from "@tcg/op-types";
import { op16Shiryu108I18n } from "./op16-108-shiryu.i18n.ts";

export const op16Shiryu108: CharacterCard = {
  id: "OP16-108",
  canonicalId: "OP16-108",
  slug: "shiryu/op16-108",
  name: "Shiryu",
  printings: [
    {
      id: "OP16-108",
      artId: "OP16-108",
      setCode: "OP16",
      collectorNumber: "108",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-108_FG2rNuo.jpg",
    },
    {
      id: "OP16-108_p1",
      artId: "OP16-108",
      setCode: "OP16",
      collectorNumber: "108",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-108_iwCfr1w.jpg",
      label: "Shiryu (Full Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP16",
  cost: 6,
  power: 8000,
  traits: ["Blackbeard Pirates Impel Down"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 {Blackbeard Pirates} type card with a cost of 6 or less from your trash to the top of your Life cards face-up. [Trigger] Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Blackbeard Pirates",
                  match: "includes",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: op16Shiryu108I18n,
};
