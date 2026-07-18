import type { CharacterCard } from "@tcg/op-types";
import { op05TohToh009I18n } from "./009-toh-toh.i18n.ts";

export const op05TohToh009: CharacterCard = {
  id: "OP05-009",
  canonicalId: "OP05-009",
  slug: "toh-toh",
  name: "Toh-Toh",
  printings: [
    {
      id: "OP05-009",
      artId: "OP05-009",
      setCode: "OP05",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-009.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect: "[On Play] Draw 1 card if your Leader has 0 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "leader",
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05TohToh009I18n,
};
