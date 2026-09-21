import type { CharacterCard } from "@tcg/op-types";
import { op17Yamato074I18n } from "./op17-074-yamato.i18n.ts";

export const op17Yamato074: CharacterCard = {
  id: "OP17-074",
  canonicalId: "OP17-074",
  slug: "yamato/op17-074",
  name: "Yamato",
  printings: [
    {
      id: "OP17-074",
      artId: "OP17-074",
      setCode: "OP17",
      collectorNumber: "074",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-074_sugpufI.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP17",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Add up to 1 DON!! card as rested from your DON!! deck.",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op17Yamato074I18n,
};
