import type { CharacterCard } from "@tcg/op-types";
import { op05Kaido118I18n } from "./118-kaido.i18n.ts";

export const op05Kaido118: CharacterCard = {
  id: "OP05-118",
  canonicalId: "OP05-118",
  slug: "kaido/op05-118",
  name: "Kaido",
  printings: [
    {
      id: "OP05-118",
      artId: "OP05-118",
      setCode: "OP05",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118.jpg",
    },
    {
      id: "OP05-118_p1",
      artId: "OP05-118_p1",
      setCode: "OP05",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "OP05",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118_p1.jpg",
      imageId: "OP05-118_p1",
    },
  ],
  effect: "[On Play] Draw 4 cards if your opponent has 3 or less Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 4,
            condition: {
              condition: "lifeCount",
              player: "opponent",
              comparison: "lte",
              value: 3,
            },
          },
        ],
      },
    ],
  },
  i18n: op05Kaido118I18n,
};
