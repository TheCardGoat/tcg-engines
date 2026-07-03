import type { CharacterCard } from "@tcg/op-types";
import { op01Gordon011I18n } from "./011-gordon.i18n.ts";

export const op01Gordon011: CharacterCard = {
  id: "OP01-011",
  canonicalId: "OP01-011",
  slug: "gordon/op01-011",
  name: "Gordon",
  printings: [
    {
      id: "OP01-011",
      artId: "OP01-011",
      setCode: "OP01",
      collectorNumber: "011",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-011.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Film"],
  attribute: "wisdom",
  effect: "[On Play] You may place 1 card from your hand at the bottom of your deck: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Gordon011I18n,
};
