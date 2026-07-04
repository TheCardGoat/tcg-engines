import type { CharacterCard } from "@tcg/op-types";
import { op13LordOfTheCoast010I18n } from "./010-lord-of-the-coast.i18n.ts";

export const op13LordOfTheCoast010: CharacterCard = {
  id: "OP13-010",
  canonicalId: "OP13-010",
  slug: "lord-of-the-coast/op13-010",
  name: "Lord of the Coast",
  printings: [
    {
      id: "OP13-010",
      artId: "OP13-010",
      setCode: "OP13",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-010_5hyWBG8.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["East Blue Neptunian"],
  attribute: "strike",
  i18n: op13LordOfTheCoast010I18n,
};
