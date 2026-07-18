import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteOpera106I18n } from "./106-charlotte-opera.i18n.ts";

export const op03CharlotteOpera106: CharacterCard = {
  id: "OP03-106",
  canonicalId: "OP03-106",
  slug: "charlotte-opera/op03-106",
  name: "Charlotte Opera",
  printings: [
    {
      id: "OP03-106",
      artId: "OP03-106",
      setCode: "OP03",
      collectorNumber: "106",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-106.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  i18n: op03CharlotteOpera106I18n,
};
