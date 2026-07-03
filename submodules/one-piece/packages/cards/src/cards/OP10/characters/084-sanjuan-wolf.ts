import type { CharacterCard } from "@tcg/op-types";
import { op10SanjuanWolf084I18n } from "./084-sanjuan-wolf.i18n.ts";

export const op10SanjuanWolf084: CharacterCard = {
  id: "OP10-084",
  canonicalId: "OP10-084",
  slug: "sanjuan-wolf",
  name: "Sanjuan.Wolf",
  printings: [
    {
      id: "OP10-084",
      artId: "OP10-084",
      setCode: "OP10",
      collectorNumber: "084",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-084.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Blackbeard Pirates Giant"],
  attribute: "special",
  i18n: op10SanjuanWolf084I18n,
};
