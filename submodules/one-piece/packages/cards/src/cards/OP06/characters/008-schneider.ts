import type { CharacterCard } from "@tcg/op-types";
import { op06Schneider008I18n } from "./008-schneider.i18n.ts";

export const op06Schneider008: CharacterCard = {
  id: "OP06-008",
  canonicalId: "OP06-008",
  slug: "schneider",
  name: "Schneider",
  printings: [
    {
      id: "OP06-008",
      artId: "OP06-008",
      setCode: "OP06",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-008.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["FILM Mugiwara Chase"],
  attribute: "wisdom",
  i18n: op06Schneider008I18n,
};
