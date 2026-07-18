import type { CharacterCard } from "@tcg/op-types";
import { op03Shirahoshi116I18n } from "./116-shirahoshi.i18n.ts";

export const op03Shirahoshi116: CharacterCard = {
  id: "OP03-116",
  canonicalId: "OP03-116",
  slug: "shirahoshi/op03-116",
  name: "Shirahoshi",
  printings: [
    {
      id: "OP03-116",
      artId: "OP03-116",
      setCode: "OP03",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP03",
  cost: 5,
  power: 0,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect: "[On Play] Draw 3 cards and trash 2 cards from your hand. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op03Shirahoshi116I18n,
};
