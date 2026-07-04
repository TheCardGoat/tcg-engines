import type { CharacterCard } from "@tcg/op-types";
import { op06Eldoraggo070I18n } from "./070-eldoraggo.i18n.ts";

export const op06Eldoraggo070: CharacterCard = {
  id: "OP06-070",
  canonicalId: "OP06-070",
  slug: "eldoraggo",
  name: "Eldoraggo",
  printings: [
    {
      id: "OP06-070",
      artId: "OP06-070",
      setCode: "OP06",
      collectorNumber: "070",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-070.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["FILM Eldoraggo Crew"],
  attribute: "special",
  i18n: op06Eldoraggo070I18n,
};
