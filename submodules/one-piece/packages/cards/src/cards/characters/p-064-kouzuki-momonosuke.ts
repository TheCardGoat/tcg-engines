import type { CharacterCard } from "@tcg/op-types";
import { pKouzukiMomonosuke064I18n } from "./p-064-kouzuki-momonosuke.i18n.ts";
export const pKouzukiMomonosuke064: CharacterCard = {
  id: "P-064",
  canonicalId: "P-064",
  slug: "kouzuki-momonosuke/p-064",
  name: "Kouzuki Momonosuke",
  printings: [
    {
      id: "P-064",
      artId: "P-064",
      setCode: "P",
      collectorNumber: "064",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-064.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  power: 8000,
  traits: ["Land of Wano", "Kouzuki Clan"],
  attribute: "special",
  cost: 6,
  counter: 1000,
  i18n: pKouzukiMomonosuke064I18n,
};
