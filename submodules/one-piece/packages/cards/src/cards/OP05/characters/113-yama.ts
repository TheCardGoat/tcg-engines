import type { CharacterCard } from "@tcg/op-types";
import { op05Yama113I18n } from "./113-yama.i18n.ts";

export const op05Yama113: CharacterCard = {
  id: "OP05-113",
  canonicalId: "OP05-113",
  slug: "yama",
  name: "Yama",
  printings: [
    {
      id: "OP05-113",
      artId: "OP05-113",
      setCode: "OP05",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05Yama113I18n,
};
