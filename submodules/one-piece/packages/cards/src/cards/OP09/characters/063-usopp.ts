import type { CharacterCard } from "@tcg/op-types";
import { op09Usopp063I18n } from "./063-usopp.i18n.ts";

export const op09Usopp063: CharacterCard = {
  id: "OP09-063",
  canonicalId: "OP09-063",
  slug: "usopp/op09-063",
  name: "Usopp",
  printings: [
    {
      id: "OP09-063",
      artId: "OP09-063",
      setCode: "OP09",
      collectorNumber: "063",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-063.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  i18n: op09Usopp063I18n,
};
