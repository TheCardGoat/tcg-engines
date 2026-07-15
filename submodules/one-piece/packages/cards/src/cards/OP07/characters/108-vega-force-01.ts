import type { CharacterCard } from "@tcg/op-types";
import { op07VegaForce01108I18n } from "./108-vega-force-01.i18n.ts";

export const op07VegaForce01108: CharacterCard = {
  id: "OP07-108",
  canonicalId: "OP07-108",
  slug: "vega-force-01",
  name: "Vega Force 01",
  printings: [
    {
      id: "OP07-108",
      artId: "OP07-108",
      setCode: "OP07",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-108.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Egghead"],
  attribute: "strike",
  effect: "NULL",
  i18n: op07VegaForce01108I18n,
};
