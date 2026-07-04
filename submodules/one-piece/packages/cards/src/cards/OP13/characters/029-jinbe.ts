import type { CharacterCard } from "@tcg/op-types";
import { op13Jinbe029I18n } from "./029-jinbe.i18n.ts";

export const op13Jinbe029: CharacterCard = {
  id: "OP13-029",
  canonicalId: "OP13-029",
  slug: "jinbe/op13-029",
  name: "Jinbe",
  printings: [
    {
      id: "OP13-029",
      artId: "OP13-029",
      setCode: "OP13",
      collectorNumber: "029",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-029_yPaBkLN.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["FILM Fish-Man Straw Hat Crew"],
  attribute: "strike",
  i18n: op13Jinbe029I18n,
};
