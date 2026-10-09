import type { CharacterCard } from "@tcg/op-types";
import { st09KouzukiMomonosuke006I18n } from "./st09-006-kouzuki-momonosuke.i18n.ts";
export const st09KouzukiMomonosuke006: CharacterCard = {
  id: "ST09-006",
  canonicalId: "ST09-006",
  slug: "kouzuki-momonosuke/st09-006",
  name: "Kouzuki Momonosuke",
  printings: [
    {
      id: "ST09-006",
      artId: "ST09-006",
      setCode: "ST09",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-006.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 2,
  traits: ["Land of Wano", "Kouzuki Clan"],
  power: 4000,
  attribute: "special",
  counter: 1000,
  i18n: st09KouzukiMomonosuke006I18n,
};
