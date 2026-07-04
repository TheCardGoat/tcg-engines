import type { CharacterCard } from "@tcg/op-types";
import { op08MontBlancCricket108I18n } from "./108-mont-blanc-cricket.i18n.ts";

export const op08MontBlancCricket108: CharacterCard = {
  id: "OP08-108",
  canonicalId: "OP08-108",
  slug: "mont-blanc-cricket/op08-108",
  name: "Mont Blanc Cricket",
  printings: [
    {
      id: "OP08-108",
      artId: "OP08-108",
      setCode: "OP08",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-108.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Monkey Mountain Alliance Jaya"],
  attribute: "strike",
  effect: "NULL",
  i18n: op08MontBlancCricket108I18n,
};
