import type { CharacterCard } from "@tcg/op-types";
import { op16ShimotsukiUshimaru088I18n } from "./op16-088-shimotsuki-ushimaru.i18n.ts";

export const op16ShimotsukiUshimaru088: CharacterCard = {
  id: "OP16-088",
  canonicalId: "OP16-088",
  slug: "shimotsuki-ushimaru/op16-088",
  name: "Shimotsuki Ushimaru",
  printings: [
    {
      id: "OP16-088",
      artId: "OP16-088",
      setCode: "OP16",
      collectorNumber: "088",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-088_ZjPh991.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP16",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op16ShimotsukiUshimaru088I18n,
};
