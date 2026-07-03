import type { CharacterCard } from "@tcg/op-types";
import { op09Jinbe067I18n } from "./067-jinbe.i18n.ts";

export const op09Jinbe067: CharacterCard = {
  id: "OP09-067",
  canonicalId: "OP09-067",
  slug: "jinbe/op09-067",
  name: "Jinbe",
  printings: [
    {
      id: "OP09-067",
      artId: "OP09-067",
      setCode: "OP09",
      collectorNumber: "067",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-067.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  i18n: op09Jinbe067I18n,
};
