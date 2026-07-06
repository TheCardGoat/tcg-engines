import type { CharacterCard } from "@tcg/op-types";
import { op09Limejuice014 } from "../../OP09/characters/014-limejuice.ts";
import { prb02LimejuicePirateFoil014I18n } from "./014-limejuice-pirate-foil.i18n.ts";

export const prb02LimejuicePirateFoil014: CharacterCard = {
  ...op09Limejuice014,
  id: "OP09-014_r2",
  slug: "limejuice-pirate-foil",
  name: "Limejuice (Pirate Foil)",
  printings: [
    {
      id: "OP09-014_r2",
      artId: "OP09-014_r2",
      setCode: "PRB02",
      collectorNumber: "014",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014_r2.jpg",
    },
    {
      id: "OP09-014_p2",
      artId: "OP09-014_p2",
      setCode: "PRB02",
      collectorNumber: "014",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014_p2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014_r1_hX8Bgxy.jpg",
      imageId: "OP09-014",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-014_p2.jpg",
      imageId: "OP09-014_p2",
    },
  ],
  i18n: prb02LimejuicePirateFoil014I18n,
};
