import type { CharacterCard } from "@tcg/op-types";
import { op10BasilHawkins109 } from "../../OP10/characters/109-basil-hawkins.ts";
import { prb02BasilHawkinsOp10109Reprint109I18n } from "./109-basil-hawkins-op10-109-reprint.i18n.ts";

export const prb02BasilHawkinsOp10109Reprint109: CharacterCard = {
  ...op10BasilHawkins109,
  id: "OP10-109_r1",
  slug: "basil-hawkins-op10-109-reprint",
  name: "Basil Hawkins - OP10-109 (Reprint)",
  printings: [
    {
      id: "OP10-109_r1",
      artId: "OP10-109_r1",
      setCode: "PRB02",
      collectorNumber: "109",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-109_r1.jpg",
    },
    {
      id: "OP10-109_p1",
      artId: "OP10-109_p1",
      setCode: "PRB02",
      collectorNumber: "109",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-109_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-109_p1.jpg",
      imageId: "OP10-109_p1",
    },
  ],
  i18n: prb02BasilHawkinsOp10109Reprint109I18n,
};
