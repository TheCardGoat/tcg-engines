import type { CharacterCard } from "@tcg/op-types";
import { op02Sphinx088I18n } from "./088-sphinx.i18n.ts";

export const op02Sphinx088: CharacterCard = {
  id: "OP02-088",
  canonicalId: "OP02-088",
  slug: "sphinx",
  name: "Sphinx",
  printings: [
    {
      id: "OP02-088",
      artId: "OP02-088",
      setCode: "OP02",
      collectorNumber: "088",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-088.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Animal Impel Down"],
  attribute: "strike",
  i18n: op02Sphinx088I18n,
};
