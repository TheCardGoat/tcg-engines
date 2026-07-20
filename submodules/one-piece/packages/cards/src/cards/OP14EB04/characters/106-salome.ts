import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Salome106I18n } from "./106-salome.i18n.ts";

export const op14eb04Salome106: CharacterCard = {
  id: "OP14-106",
  canonicalId: "OP14-106",
  slug: "salome/op14-106",
  name: "Salome",
  printings: [
    {
      id: "OP14-106",
      artId: "OP14-106",
      setCode: "OP14EB04",
      collectorNumber: "106",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-106_wBHK5sQ.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 1000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Animal", "Amazon Lily"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [{ action: "playThisCard" }],
      },
    ],
  },
  i18n: op14eb04Salome106I18n,
};
