import type { CharacterCard } from "@tcg/op-types";
import { op13NefeltariCobra011I18n } from "./011-nefeltari-cobra.i18n.ts";

export const op13NefeltariCobra011: CharacterCard = {
  id: "OP13-011",
  canonicalId: "OP13-011",
  slug: "nefeltari-cobra/op13-011",
  name: "Nefeltari Cobra",
  printings: [
    {
      id: "OP13-011",
      artId: "OP13-011",
      setCode: "OP13",
      collectorNumber: "011",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-011_53FS5nP.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  i18n: op13NefeltariCobra011I18n,
};
