import type { CharacterCard } from "@tcg/op-types";
import { op08Sweetpea048I18n } from "./048-sweetpea.i18n.ts";

export const op08Sweetpea048: CharacterCard = {
  id: "OP08-048",
  canonicalId: "OP08-048",
  slug: "sweetpea",
  name: "Sweetpea",
  printings: [
    {
      id: "OP08-048",
      artId: "OP08-048",
      setCode: "OP08",
      collectorNumber: "048",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-048.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Amazon Lily"],
  attribute: "strike",
  effect: "NULL",
  i18n: op08Sweetpea048I18n,
};
