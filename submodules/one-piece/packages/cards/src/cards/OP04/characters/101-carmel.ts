import type { CharacterCard } from "@tcg/op-types";
import { op04Carmel101I18n } from "./101-carmel.i18n.ts";

export const op04Carmel101: CharacterCard = {
  id: "OP04-101",
  canonicalId: "OP04-101",
  slug: "carmel",
  name: "Carmel",
  printings: [
    {
      id: "OP04-101",
      artId: "OP04-101",
      setCode: "OP04",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-101.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["The House of Lambs"],
  attribute: "wisdom",
  effect:
    "[Your Turn] [On Play] Draw 1 card. [Trigger] Play this card. Then, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
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
        actions: [
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
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
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
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Carmel101I18n,
};
