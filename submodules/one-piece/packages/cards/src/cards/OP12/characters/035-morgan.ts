import type { CharacterCard } from "@tcg/op-types";
import { op12Morgan035I18n } from "./035-morgan.i18n.ts";

export const op12Morgan035: CharacterCard = {
  id: "OP12-035",
  canonicalId: "OP12-035",
  slug: "morgan/op12-035",
  name: "Morgan",
  printings: [
    {
      id: "OP12-035",
      artId: "OP12-035",
      setCode: "OP12",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-035_49npQPJ.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Navy East Blue"],
  attribute: "slash",
  i18n: op12Morgan035I18n,
};
