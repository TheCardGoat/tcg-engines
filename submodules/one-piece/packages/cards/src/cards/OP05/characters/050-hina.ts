import type { CharacterCard } from "@tcg/op-types";
import { op05Hina050I18n } from "./050-hina.i18n.ts";

export const op05Hina050: CharacterCard = {
  id: "OP05-050",
  canonicalId: "OP05-050",
  slug: "hina/op05-050",
  name: "Hina",
  printings: [
    {
      id: "OP05-050",
      artId: "OP05-050",
      setCode: "OP05",
      collectorNumber: "050",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-050.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect: "[On Play] Draw 1 card if you have 5 or less cards in your hand.",
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
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 5,
            },
          },
        ],
      },
    ],
  },
  i18n: op05Hina050I18n,
};
