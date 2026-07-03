import type { CharacterCard } from "@tcg/op-types";
import { op12DouglasBullet010I18n } from "./010-douglas-bullet.i18n.ts";

export const op12DouglasBullet010: CharacterCard = {
  id: "OP12-010",
  canonicalId: "OP12-010",
  slug: "douglas-bullet/op12-010",
  name: "Douglas Bullet",
  printings: [
    {
      id: "OP12-010",
      artId: "OP12-010",
      setCode: "OP12",
      collectorNumber: "010",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-010_WcE3NpY.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["FILM The Pirates Fest Former Roger Pirates"],
  attribute: "special",
  i18n: op12DouglasBullet010I18n,
};
