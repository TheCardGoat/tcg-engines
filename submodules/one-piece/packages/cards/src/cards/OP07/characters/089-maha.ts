import type { CharacterCard } from "@tcg/op-types";
import { op07Maha089I18n } from "./089-maha.i18n.ts";

export const op07Maha089: CharacterCard = {
  id: "OP07-089",
  canonicalId: "OP07-089",
  slug: "maha",
  name: "Maha",
  printings: [
    {
      id: "OP07-089",
      artId: "OP07-089",
      setCode: "OP07",
      collectorNumber: "089",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-089.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "strike",
  effect: "NULL",
  i18n: op07Maha089I18n,
};
