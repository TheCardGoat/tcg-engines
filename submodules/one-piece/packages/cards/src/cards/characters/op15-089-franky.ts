import type { CharacterCard } from "@tcg/op-types";
import { op15Franky089I18n } from "./op15-089-franky.i18n.ts";

export const op15Franky089: CharacterCard = {
  id: "OP15-089",
  canonicalId: "OP15-089",
  slug: "franky/op15-089",
  name: "Franky",
  printings: [
    {
      id: "OP15-089",
      artId: "OP15-089",
      setCode: "OP15",
      collectorNumber: "089",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-089_Pb9Rr6E.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP15",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  i18n: op15Franky089I18n,
};
