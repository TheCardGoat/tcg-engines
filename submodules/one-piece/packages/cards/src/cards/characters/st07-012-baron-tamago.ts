import type { CharacterCard } from "@tcg/op-types";
import { st07BaronTamago012I18n } from "./st07-012-baron-tamago.i18n.ts";
export const st07BaronTamago012: CharacterCard = {
  id: "ST07-012",
  canonicalId: "ST07-012",
  slug: "baron-tamago/st07-012",
  name: "Baron Tamago",
  printings: [
    {
      id: "ST07-012",
      artId: "ST07-012",
      setCode: "ST07",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-012.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 4,
  traits: ["Big Mom Pirates"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  i18n: st07BaronTamago012I18n,
};
