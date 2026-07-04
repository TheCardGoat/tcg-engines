import type { CharacterCard } from "@tcg/op-types";
import { op09AvaloPizarro082I18n } from "./082-avalo-pizarro.i18n.ts";

export const op09AvaloPizarro082: CharacterCard = {
  id: "OP09-082",
  canonicalId: "OP09-082",
  slug: "avalo-pizarro",
  name: "Avalo Pizarro",
  printings: [
    {
      id: "OP09-082",
      artId: "OP09-082",
      setCode: "OP09",
      collectorNumber: "082",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-082.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  i18n: op09AvaloPizarro082I18n,
};
