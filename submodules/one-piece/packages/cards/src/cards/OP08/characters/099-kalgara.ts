import type { CharacterCard } from "@tcg/op-types";
import { op08Kalgara099I18n } from "./099-kalgara.i18n.ts";

export const op08Kalgara099: CharacterCard = {
  id: "OP08-099",
  canonicalId: "OP08-099",
  slug: "kalgara/op08-099",
  name: "Kalgara",
  printings: [
    {
      id: "OP08-099",
      artId: "OP08-099",
      setCode: "OP08",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  effect: "NULL",
  i18n: op08Kalgara099I18n,
};
