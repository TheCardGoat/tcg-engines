import type { CharacterCard } from "@tcg/op-types";
import { op12Seto103I18n } from "./103-seto.i18n.ts";

export const op12Seto103: CharacterCard = {
  id: "OP12-103",
  canonicalId: "OP12-103",
  slug: "seto",
  name: "Seto",
  printings: [
    {
      id: "OP12-103",
      artId: "OP12-103",
      setCode: "OP12",
      collectorNumber: "103",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-103_hOeIM7r.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  i18n: op12Seto103I18n,
};
