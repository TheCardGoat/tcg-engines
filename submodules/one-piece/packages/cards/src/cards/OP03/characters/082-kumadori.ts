import type { CharacterCard } from "@tcg/op-types";
import { op03Kumadori082I18n } from "./082-kumadori.i18n.ts";

export const op03Kumadori082: CharacterCard = {
  id: "OP03-082",
  canonicalId: "OP03-082",
  slug: "kumadori",
  name: "Kumadori",
  printings: [
    {
      id: "OP03-082",
      artId: "OP03-082",
      setCode: "OP03",
      collectorNumber: "082",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-082.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  i18n: op03Kumadori082I18n,
};
