import type { CharacterCard } from "@tcg/op-types";
import { op08BasilHawkins089I18n } from "./089-basil-hawkins.i18n.ts";

export const op08BasilHawkins089: CharacterCard = {
  id: "OP08-089",
  canonicalId: "OP08-089",
  slug: "basil-hawkins/op08-089",
  name: "Basil Hawkins",
  printings: [
    {
      id: "OP08-089",
      artId: "OP08-089",
      setCode: "OP08",
      collectorNumber: "089",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-089.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Hawkins Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op08BasilHawkins089I18n,
};
