import type { CharacterCard } from "@tcg/op-types";
import { op09Richie054I18n } from "./054-richie.i18n.ts";

export const op09Richie054: CharacterCard = {
  id: "OP09-054",
  canonicalId: "OP09-054",
  slug: "richie",
  name: "Richie",
  printings: [
    {
      id: "OP09-054",
      artId: "OP09-054",
      setCode: "OP09",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-054.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Animal Cross Guild"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op09Richie054I18n,
};
