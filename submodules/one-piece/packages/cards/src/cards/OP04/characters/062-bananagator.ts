import type { CharacterCard } from "@tcg/op-types";
import { op04Bananagator062I18n } from "./062-bananagator.i18n.ts";

export const op04Bananagator062: CharacterCard = {
  id: "OP04-062",
  canonicalId: "OP04-062",
  slug: "bananagator",
  name: "Bananagator",
  printings: [
    {
      id: "OP04-062",
      artId: "OP04-062",
      setCode: "OP04",
      collectorNumber: "062",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-062.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal"],
  attribute: "strike",
  i18n: op04Bananagator062I18n,
};
