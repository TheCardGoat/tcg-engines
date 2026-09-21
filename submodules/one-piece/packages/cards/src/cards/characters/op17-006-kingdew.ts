import type { CharacterCard } from "@tcg/op-types";
import { op17Kingdew006I18n } from "./op17-006-kingdew.i18n.ts";

export const op17Kingdew006: CharacterCard = {
  id: "OP17-006",
  canonicalId: "OP17-006",
  slug: "kingdew/op17-006",
  name: "Kingdew",
  printings: [
    {
      id: "OP17-006",
      artId: "OP17-006",
      setCode: "OP17",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-006_XIlMtK9.jpg",
    },
    {
      id: "OP17-006_p1",
      artId: "OP17-006",
      setCode: "OP17",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-006_W3SCXgC.jpg",
      label: "Kingdew (Pandaman Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 7,
  power: 8000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  i18n: op17Kingdew006I18n,
};
