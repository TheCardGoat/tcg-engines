import type { CharacterCard } from "@tcg/op-types";
import { op10CloneSoldier064I18n } from "./064-clone-soldier.i18n.ts";

export const op10CloneSoldier064: CharacterCard = {
  id: "OP10-064",
  canonicalId: "OP10-064",
  slug: "clone-soldier",
  name: "Clone Soldier",
  printings: [
    {
      id: "OP10-064",
      artId: "OP10-064",
      setCode: "OP10",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-064.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op10CloneSoldier064I18n,
};
