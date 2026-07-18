import type { CharacterCard } from "@tcg/op-types";
import { op01Vergo065I18n } from "./065-vergo.i18n.ts";

export const op01Vergo065: CharacterCard = {
  id: "OP01-065",
  canonicalId: "OP01-065",
  slug: "vergo/op01-065",
  name: "Vergo",
  printings: [
    {
      id: "OP01-065",
      artId: "OP01-065",
      setCode: "OP01",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-065.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy Punk Hazard"],
  attribute: "strike",
  i18n: op01Vergo065I18n,
};
