import type { CharacterCard } from "@tcg/op-types";
import { op06Wadatsumi037I18n } from "./037-wadatsumi.i18n.ts";

export const op06Wadatsumi037: CharacterCard = {
  id: "OP06-037",
  canonicalId: "OP06-037",
  slug: "wadatsumi/op06-037",
  name: "Wadatsumi",
  printings: [
    {
      id: "OP06-037",
      artId: "OP06-037",
      setCode: "OP06",
      collectorNumber: "037",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-037.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Fish-Man Flying Pirates"],
  attribute: "strike",
  i18n: op06Wadatsumi037I18n,
};
