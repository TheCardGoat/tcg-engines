import type { CharacterCard } from "@tcg/op-types";
import { op10Hajrudin050I18n } from "./050-hajrudin.i18n.ts";

export const op10Hajrudin050: CharacterCard = {
  id: "OP10-050",
  canonicalId: "OP10-050",
  slug: "hajrudin/op10-050",
  name: "Hajrudin",
  printings: [
    {
      id: "OP10-050",
      artId: "OP10-050",
      setCode: "OP10",
      collectorNumber: "050",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-050.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Giant Dressrosa New Giant Pirates"],
  attribute: "strike",
  i18n: op10Hajrudin050I18n,
};
