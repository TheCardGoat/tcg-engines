import type { CharacterCard } from "@tcg/op-types";
import { st04PageOne012I18n } from "./st04-012-page-one.i18n.ts";

export const st04PageOne012: CharacterCard = {
  id: "ST04-012",
  canonicalId: "ST04-012",
  slug: "page-one/st04-012",
  name: "Page One",
  printings: [
    {
      id: "ST04-012",
      artId: "ST04-012",
      setCode: "ST04",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-012.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 4,
  traits: ["Animal Kingdom Pirates"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  i18n: st04PageOne012I18n,
};
