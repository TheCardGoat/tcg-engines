import type { CharacterCard } from "@tcg/op-types";
import { op04OimoKashii078I18n } from "./078-oimo-kashii.i18n.ts";

export const op04OimoKashii078: CharacterCard = {
  id: "OP04-078",
  canonicalId: "OP04-078",
  slug: "oimo-kashii",
  name: "Oimo & Kashii",
  printings: [
    {
      id: "OP04-078",
      artId: "OP04-078",
      setCode: "OP04",
      collectorNumber: "078",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-078.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Giant", "World Government"],
  attribute: "strike",
  i18n: op04OimoKashii078I18n,
};
