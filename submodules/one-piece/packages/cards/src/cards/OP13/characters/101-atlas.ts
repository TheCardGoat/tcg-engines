import type { CharacterCard } from "@tcg/op-types";
import { op13Atlas101I18n } from "./101-atlas.i18n.ts";

export const op13Atlas101: CharacterCard = {
  id: "OP13-101",
  canonicalId: "OP13-101",
  slug: "atlas/op13-101",
  name: "Atlas",
  printings: [
    {
      id: "OP13-101",
      artId: "OP13-101",
      setCode: "OP13",
      collectorNumber: "101",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-101_UWB1rSb.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  i18n: op13Atlas101I18n,
};
