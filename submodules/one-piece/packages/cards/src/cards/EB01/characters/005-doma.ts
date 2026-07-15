import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005I18n } from "./005-doma.i18n.ts";

export const eb01Doma005: CharacterCard = {
  id: "EB01-005",
  canonicalId: "EB01-005",
  slug: "doma",
  name: "Doma",
  printings: [
    {
      id: "EB01-005",
      artId: "EB01-005",
      setCode: "EB01",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-005.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  i18n: eb01Doma005I18n,
};
