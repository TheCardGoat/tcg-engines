import type { CharacterCard } from "@tcg/op-types";
import { op12Wyper114I18n } from "./114-wyper.i18n.ts";

export const op12Wyper114: CharacterCard = {
  id: "OP12-114",
  canonicalId: "OP12-114",
  slug: "wyper/op12-114",
  name: "Wyper",
  printings: [
    {
      id: "OP12-114",
      artId: "OP12-114",
      setCode: "OP12",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-114_QKwU3sg.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  i18n: op12Wyper114I18n,
};
