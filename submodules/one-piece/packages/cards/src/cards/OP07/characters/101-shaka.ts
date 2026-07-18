import type { CharacterCard } from "@tcg/op-types";
import { op07Shaka101I18n } from "./101-shaka.i18n.ts";

export const op07Shaka101: CharacterCard = {
  id: "OP07-101",
  canonicalId: "OP07-101",
  slug: "shaka/op07-101",
  name: "Shaka",
  printings: [
    {
      id: "OP07-101",
      artId: "OP07-101",
      setCode: "OP07",
      collectorNumber: "101",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-101.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Trigger] If your Leader is [Vegapunk], play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Vegapunk",
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op07Shaka101I18n,
};
