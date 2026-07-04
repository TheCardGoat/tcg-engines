import type { CharacterCard } from "@tcg/op-types";
import { op11BirdNeptunian033I18n } from "./033-bird-neptunian.i18n.ts";

export const op11BirdNeptunian033: CharacterCard = {
  id: "OP11-033",
  canonicalId: "OP11-033",
  slug: "bird-neptunian/op11-033",
  name: "Bird Neptunian",
  printings: [
    {
      id: "OP11-033",
      artId: "OP11-033",
      setCode: "OP11",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-033.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Neptunian"],
  attribute: "strike",
  i18n: op11BirdNeptunian033I18n,
};
