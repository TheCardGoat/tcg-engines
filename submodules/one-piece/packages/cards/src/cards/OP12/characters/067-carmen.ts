import type { CharacterCard } from "@tcg/op-types";
import { op12Carmen067I18n } from "./067-carmen.i18n.ts";

export const op12Carmen067: CharacterCard = {
  id: "OP12-067",
  canonicalId: "OP12-067",
  slug: "carmen",
  name: "Carmen",
  printings: [
    {
      id: "OP12-067",
      artId: "OP12-067",
      setCode: "OP12",
      collectorNumber: "067",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-067_3mowvrG.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  i18n: op12Carmen067I18n,
};
