import type { CharacterCard } from "@tcg/op-types";
import { op07Jinbe027I18n } from "./027-jinbe.i18n.ts";

export const op07Jinbe027: CharacterCard = {
  id: "OP07-027",
  canonicalId: "OP07-027",
  slug: "jinbe/op07-027",
  name: "Jinbe",
  printings: [
    {
      id: "OP07-027",
      artId: "OP07-027",
      setCode: "OP07",
      collectorNumber: "027",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-027.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "strike",
  effect: "NULL",
  i18n: op07Jinbe027I18n,
};
