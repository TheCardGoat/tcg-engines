import type { CharacterCard } from "@tcg/op-types";
import { op09HowlingGab006I18n } from "./006-howling-gab.i18n.ts";

export const op09HowlingGab006: CharacterCard = {
  id: "OP09-006",
  canonicalId: "OP09-006",
  slug: "howling-gab",
  name: "Howling Gab",
  printings: [
    {
      id: "OP09-006",
      artId: "OP09-006",
      setCode: "OP09",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-006.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "special",
  i18n: op09HowlingGab006I18n,
};
