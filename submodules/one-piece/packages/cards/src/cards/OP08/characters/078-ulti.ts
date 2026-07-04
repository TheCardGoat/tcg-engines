import type { CharacterCard } from "@tcg/op-types";
import { op08Ulti078I18n } from "./078-ulti.i18n.ts";

export const op08Ulti078: CharacterCard = {
  id: "OP08-078",
  canonicalId: "OP08-078",
  slug: "ulti/op08-078",
  name: "Ulti",
  printings: [
    {
      id: "OP08-078",
      artId: "OP08-078",
      setCode: "OP08",
      collectorNumber: "078",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-078.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect: "NULL",
  i18n: op08Ulti078I18n,
};
