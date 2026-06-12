import type { CharacterCard } from "@tcg/op-types";
import { op07Franky107I18n } from "./107-franky.i18n.ts";

export const op07Franky107: CharacterCard = {
  id: "OP07-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger: "Draw 1 card. Then, if you have 1 or less Life cards, play this card.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-107_p1.jpg",
      imageId: "OP07-107_p1",
    },
  ],
  effect: "[Trigger] Draw 1 card. Then, if you have 1 or less Life cards, play this card.",
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
            },
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op07Franky107I18n,
};
