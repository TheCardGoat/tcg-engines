import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteLola052I18n } from "./052-charlotte-lola.i18n.ts";

export const op11CharlotteLola052: CharacterCard = {
  id: "OP11-052",
  canonicalId: "OP11-052",
  slug: "charlotte-lola",
  name: "Charlotte Lola",
  printings: [
    {
      id: "OP11-052",
      artId: "OP11-052",
      setCode: "OP11",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-052.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Firetank Pirates Former Rolling Pirates"],
  attribute: "slash",
  i18n: op11CharlotteLola052I18n,
};
