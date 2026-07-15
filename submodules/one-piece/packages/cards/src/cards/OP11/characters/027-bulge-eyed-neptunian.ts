import type { CharacterCard } from "@tcg/op-types";
import { op11BulgeEyedNeptunian027I18n } from "./027-bulge-eyed-neptunian.i18n.ts";

export const op11BulgeEyedNeptunian027: CharacterCard = {
  id: "OP11-027",
  canonicalId: "OP11-027",
  slug: "bulge-eyed-neptunian",
  name: "Bulge-Eyed Neptunian",
  printings: [
    {
      id: "OP11-027",
      artId: "OP11-027",
      setCode: "OP11",
      collectorNumber: "027",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-027.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 6000,
  traits: ["Neptunian"],
  attribute: "strike",
  effect:
    "If your Leader is [Shirahoshi], this Character can attack Characters on the turn in which it is played.",
  i18n: op11BulgeEyedNeptunian027I18n,
};
