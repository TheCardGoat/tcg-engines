import type { CharacterCard } from "@tcg/op-types";
import { eb01Shirahoshi057 } from "../../EB01/characters/057-shirahoshi.ts";
import { prb02ShirahoshiReprint057I18n } from "./057-shirahoshi-reprint.i18n.ts";

export const prb02ShirahoshiReprint057: CharacterCard = {
  ...eb01Shirahoshi057,
  id: "EB01-057_r1",
  slug: "shirahoshi-reprint",
  name: "Shirahoshi (Reprint)",
  printings: [
    {
      id: "EB01-057_r1",
      artId: "EB01-057_r1",
      setCode: "PRB02",
      collectorNumber: "057",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-057_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02ShirahoshiReprint057I18n,
};
