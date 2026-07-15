import type { CharacterCard } from "@tcg/op-types";
import { op07Bartolomeo031 } from "../../OP07/characters/031-bartolomeo.ts";
import { prb02BartolomeoPirateFoil031I18n } from "./031-bartolomeo-pirate-foil.i18n.ts";

export const prb02BartolomeoPirateFoil031: CharacterCard = {
  ...op07Bartolomeo031,
  id: "OP07-031_p1",
  slug: "bartolomeo-pirate-foil",
  name: "Bartolomeo (Pirate Foil)",
  printings: [
    {
      id: "OP07-031_p1",
      artId: "OP07-031_p1",
      setCode: "PRB02",
      collectorNumber: "031",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-031_p1.jpg",
    },
    {
      id: "OP07-031_r2",
      artId: "OP07-031_r2",
      setCode: "PRB02",
      collectorNumber: "031",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-031_r2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-031_r2.jpg",
      imageId: "OP07-031_r2",
    },
  ],
  i18n: prb02BartolomeoPirateFoil031I18n,
};
