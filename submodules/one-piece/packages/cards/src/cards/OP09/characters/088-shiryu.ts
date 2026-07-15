import type { CharacterCard } from "@tcg/op-types";
import { op09Shiryu088I18n } from "./088-shiryu.i18n.ts";

export const op09Shiryu088: CharacterCard = {
  id: "OP09-088",
  canonicalId: "OP09-088",
  slug: "shiryu/op09-088",
  name: "Shiryu",
  printings: [
    {
      id: "OP09-088",
      artId: "OP09-088",
      setCode: "OP09",
      collectorNumber: "088",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-088.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Blackbeard Pirates"],
  attribute: "slash",
  effect: "[DON!! x1] [When Attacking] You may trash 2 cards from your hand: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Shiryu088I18n,
};
