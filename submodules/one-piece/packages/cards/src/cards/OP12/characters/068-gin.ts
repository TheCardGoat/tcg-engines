import type { CharacterCard } from "@tcg/op-types";
import { op12Gin068I18n } from "./068-gin.i18n.ts";

export const op12Gin068: CharacterCard = {
  id: "OP12-068",
  canonicalId: "OP12-068",
  slug: "gin/op12-068",
  name: "Gin",
  printings: [
    {
      id: "OP12-068",
      artId: "OP12-068",
      setCode: "OP12",
      collectorNumber: "068",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-068_y9OJZOc.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Krieg Pirates East Blue"],
  attribute: "strike",
  i18n: op12Gin068I18n,
};
