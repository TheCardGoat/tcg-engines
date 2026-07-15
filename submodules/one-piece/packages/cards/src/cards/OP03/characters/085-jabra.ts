import type { CharacterCard } from "@tcg/op-types";
import { op03Jabra085I18n } from "./085-jabra.i18n.ts";

export const op03Jabra085: CharacterCard = {
  id: "OP03-085",
  canonicalId: "OP03-085",
  slug: "jabra",
  name: "Jabra",
  printings: [
    {
      id: "OP03-085",
      artId: "OP03-085",
      setCode: "OP03",
      collectorNumber: "085",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-085.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  effect: "NULL",
  i18n: op03Jabra085I18n,
};
