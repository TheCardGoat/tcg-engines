import type { CharacterCard } from "@tcg/op-types";
import { op03CharlottePraline111I18n } from "./111-charlotte-praline.i18n.ts";

export const op03CharlottePraline111: CharacterCard = {
  id: "OP03-111",
  canonicalId: "OP03-111",
  slug: "charlotte-praline/op03-111",
  name: "Charlotte Praline",
  printings: [
    {
      id: "OP03-111",
      artId: "OP03-111",
      setCode: "OP03",
      collectorNumber: "111",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-111.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["The Sun Pirates Merfolk"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op03CharlottePraline111I18n,
};
