import type { CharacterCard } from "@tcg/op-types";
import { op15Fullbody016I18n } from "./op15-016-fullbody.i18n.ts";

export const op15Fullbody016: CharacterCard = {
  id: "OP15-016",
  canonicalId: "OP15-016",
  slug: "fullbody/op15-016",
  name: "Fullbody",
  printings: [
    {
      id: "OP15-016",
      artId: "OP15-016",
      setCode: "OP15",
      collectorNumber: "016",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-016_DZ6lIoF.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP15",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "strike",
  i18n: op15Fullbody016I18n,
};
