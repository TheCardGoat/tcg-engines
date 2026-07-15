import type { CharacterCard } from "@tcg/op-types";
import { op12Baby5111I18n } from "./111-baby-5.i18n.ts";

export const op12Baby5111: CharacterCard = {
  id: "OP12-111",
  canonicalId: "OP12-111",
  slug: "baby-5/op12-111",
  name: "Baby 5",
  printings: [
    {
      id: "OP12-111",
      artId: "OP12-111",
      setCode: "OP12",
      collectorNumber: "111",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-111_qzpq8Mp.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  i18n: op12Baby5111I18n,
};
