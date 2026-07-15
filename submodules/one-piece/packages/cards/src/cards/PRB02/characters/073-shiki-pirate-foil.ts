import type { CharacterCard } from "@tcg/op-types";
import { op06Shiki073 } from "../../OP06/characters/073-shiki.ts";
import { prb02ShikiPirateFoil073I18n } from "./073-shiki-pirate-foil.i18n.ts";

export const prb02ShikiPirateFoil073: CharacterCard = {
  ...op06Shiki073,
  id: "OP06-073_p1",
  slug: "shiki-pirate-foil",
  name: "Shiki (Pirate Foil)",
  printings: [
    {
      id: "OP06-073_p1",
      artId: "OP06-073_p1",
      setCode: "PRB02",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-073_p1.jpg",
    },
    {
      id: "OP06-073_r1",
      artId: "OP06-073_r1",
      setCode: "PRB02",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-073_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-073_r1.jpg",
      imageId: "OP06-073_r1",
    },
  ],
  i18n: prb02ShikiPirateFoil073I18n,
};
