import type { CharacterCard } from "@tcg/op-types";
import { op07Moda014 } from "../../OP07/characters/014-moda.ts";
import { prb02ModaPirateFoil014I18n } from "./014-moda-pirate-foil.i18n.ts";

export const prb02ModaPirateFoil014: CharacterCard = {
  ...op07Moda014,
  id: "OP07-014_r1_LLH4ouU",
  slug: "moda-pirate-foil",
  name: "Moda (Pirate Foil)",
  printings: [
    {
      id: "OP07-014_r1_LLH4ouU",
      artId: "OP07-014_r1_LLH4ouU",
      setCode: "PRB02",
      collectorNumber: "014",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-014_r1_LLH4ouU.jpg",
    },
    {
      id: "OP07-014_r1",
      artId: "OP07-014_r1",
      setCode: "PRB02",
      collectorNumber: "014",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-014_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-014_r1.jpg",
      imageId: "OP07-014_r1",
    },
  ],
  i18n: prb02ModaPirateFoil014I18n,
};
