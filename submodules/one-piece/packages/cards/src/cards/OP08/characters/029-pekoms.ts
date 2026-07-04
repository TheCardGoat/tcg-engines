import type { CharacterCard } from "@tcg/op-types";
import { op08Pekoms029I18n } from "./029-pekoms.i18n.ts";

export const op08Pekoms029: CharacterCard = {
  id: "OP08-029",
  canonicalId: "OP08-029",
  slug: "pekoms",
  name: "Pekoms",
  printings: [
    {
      id: "OP08-029",
      artId: "OP08-029",
      setCode: "OP08",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-029.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 6000,
  traits: ["Minks Big Mom Pirates"],
  attribute: "strike",
  effect:
    "If this Character is active, your {Minks} type Characters with a cost of 3 or less other than [Pekoms] cannot be K.O.'d by effects.",
  i18n: op08Pekoms029I18n,
};
