import type { CharacterCard } from "@tcg/op-types";
import { op03Pearl031I18n } from "./031-pearl.i18n.ts";

export const op03Pearl031: CharacterCard = {
  id: "OP03-031",
  canonicalId: "OP03-031",
  slug: "pearl",
  name: "Pearl",
  printings: [
    {
      id: "OP03-031",
      artId: "OP03-031",
      setCode: "OP03",
      collectorNumber: "031",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-031.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Krieg Pirates East Blue"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03Pearl031I18n,
};
