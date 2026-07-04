import type { CharacterCard } from "@tcg/op-types";
import { op13Shaka107I18n } from "./107-shaka.i18n.ts";

export const op13Shaka107: CharacterCard = {
  id: "OP13-107",
  canonicalId: "OP13-107",
  slug: "shaka/op13-107",
  name: "Shaka",
  printings: [
    {
      id: "OP13-107",
      artId: "OP13-107",
      setCode: "OP13",
      collectorNumber: "107",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-107_8J2oXLY.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  i18n: op13Shaka107I18n,
};
