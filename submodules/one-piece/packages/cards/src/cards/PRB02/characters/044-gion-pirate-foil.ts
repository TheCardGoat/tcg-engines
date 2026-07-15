import type { CharacterCard } from "@tcg/op-types";
import { op06Gion044 } from "../../OP06/characters/044-gion.ts";
import { prb02GionPirateFoil044I18n } from "./044-gion-pirate-foil.i18n.ts";

export const prb02GionPirateFoil044: CharacterCard = {
  ...op06Gion044,
  id: "OP06-044_p1",
  slug: "gion-pirate-foil",
  name: "Gion (Pirate Foil)",
  printings: [
    {
      id: "OP06-044_p1",
      artId: "OP06-044_p1",
      setCode: "PRB02",
      collectorNumber: "044",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-044_p1.jpg",
    },
    {
      id: "OP06-044_r1",
      artId: "OP06-044_r1",
      setCode: "PRB02",
      collectorNumber: "044",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-044_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-044_r1.jpg",
      imageId: "OP06-044_r1",
    },
  ],
  i18n: prb02GionPirateFoil044I18n,
};
