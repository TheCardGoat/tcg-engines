import type { CharacterCard } from "@tcg/op-types";
import { op07Urouge021 } from "../../OP07/characters/021-urouge.ts";
import { prb02UrougeReprint021I18n } from "./021-urouge-reprint.i18n.ts";

export const prb02UrougeReprint021: CharacterCard = {
  ...op07Urouge021,
  id: "OP07-021_r2",
  slug: "urouge-reprint",
  name: "Urouge (Reprint)",
  printings: [
    {
      id: "OP07-021_r2",
      artId: "OP07-021_r2",
      setCode: "PRB02",
      collectorNumber: "021",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-021_r2.jpg",
    },
    {
      id: "OP07-021_p8",
      artId: "OP07-021_p8",
      setCode: "PRB02",
      collectorNumber: "021",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-021_p8.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-021_p8.jpg",
      imageId: "OP07-021_p8",
    },
  ],
  i18n: prb02UrougeReprint021I18n,
};
