import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteDaifuku068I18n } from "./068-charlotte-daifuku.i18n.ts";

export const op11CharlotteDaifuku068: CharacterCard = {
  id: "OP11-068",
  canonicalId: "OP11-068",
  slug: "charlotte-daifuku",
  name: "Charlotte Daifuku",
  printings: [
    {
      id: "OP11-068",
      artId: "OP11-068",
      setCode: "OP11",
      collectorNumber: "068",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-068.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  i18n: op11CharlotteDaifuku068I18n,
};
