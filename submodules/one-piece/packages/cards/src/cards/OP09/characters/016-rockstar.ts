import type { CharacterCard } from "@tcg/op-types";
import { op09Rockstar016I18n } from "./016-rockstar.i18n.ts";

export const op09Rockstar016: CharacterCard = {
  id: "OP09-016",
  canonicalId: "OP09-016",
  slug: "rockstar",
  name: "Rockstar",
  printings: [
    {
      id: "OP09-016",
      artId: "OP09-016",
      setCode: "OP09",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-016.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "slash",
  i18n: op09Rockstar016I18n,
};
