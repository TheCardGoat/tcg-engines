import type { CharacterCard } from "@tcg/op-types";
import { op11ScaledNeptunian026I18n } from "./026-scaled-neptunian.i18n.ts";

export const op11ScaledNeptunian026: CharacterCard = {
  id: "OP11-026",
  canonicalId: "OP11-026",
  slug: "scaled-neptunian/op11-026",
  name: "Scaled Neptunian",
  printings: [
    {
      id: "OP11-026",
      artId: "OP11-026",
      setCode: "OP11",
      collectorNumber: "026",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-026.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Neptunian"],
  attribute: "strike",
  i18n: op11ScaledNeptunian026I18n,
};
