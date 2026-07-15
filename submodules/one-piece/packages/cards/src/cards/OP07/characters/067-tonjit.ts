import type { CharacterCard } from "@tcg/op-types";
import { op07Tonjit067I18n } from "./067-tonjit.i18n.ts";

export const op07Tonjit067: CharacterCard = {
  id: "OP07-067",
  canonicalId: "OP07-067",
  slug: "tonjit",
  name: "Tonjit",
  printings: [
    {
      id: "OP07-067",
      artId: "OP07-067",
      setCode: "OP07",
      collectorNumber: "067",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-067.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Long Ring Long Land"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op07Tonjit067I18n,
};
