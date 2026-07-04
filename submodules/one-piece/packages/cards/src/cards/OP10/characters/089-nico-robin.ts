import type { CharacterCard } from "@tcg/op-types";
import { op10NicoRobin089I18n } from "./089-nico-robin.i18n.ts";

export const op10NicoRobin089: CharacterCard = {
  id: "OP10-089",
  canonicalId: "OP10-089",
  slug: "nico-robin/op10-089",
  name: "Nico Robin",
  printings: [
    {
      id: "OP10-089",
      artId: "OP10-089",
      setCode: "OP10",
      collectorNumber: "089",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-089.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP10",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "strike",
  i18n: op10NicoRobin089I18n,
};
