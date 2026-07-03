import type { CharacterCard } from "@tcg/op-types";
import { op09VascoShot091I18n } from "./091-vasco-shot.i18n.ts";

export const op09VascoShot091: CharacterCard = {
  id: "OP09-091",
  canonicalId: "OP09-091",
  slug: "vasco-shot",
  name: "Vasco Shot",
  printings: [
    {
      id: "OP09-091",
      artId: "OP09-091",
      setCode: "OP09",
      collectorNumber: "091",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-091.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op09VascoShot091I18n,
};
