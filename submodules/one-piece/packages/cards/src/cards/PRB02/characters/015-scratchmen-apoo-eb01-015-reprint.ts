import type { CharacterCard } from "@tcg/op-types";
import { eb01ScratchmenApoo015 } from "../../EB01/characters/015-scratchmen-apoo.ts";
import { prb02ScratchmenApooEb01015Reprint015I18n } from "./015-scratchmen-apoo-eb01-015-reprint.i18n.ts";

export const prb02ScratchmenApooEb01015Reprint015: CharacterCard = {
  ...eb01ScratchmenApoo015,
  id: "EB01-015_r1",
  slug: "scratchmen-apoo-eb01-015-reprint",
  name: "Scratchmen Apoo - EB01-015 (Reprint)",
  printings: [
    {
      id: "EB01-015_r1",
      artId: "EB01-015_r1",
      setCode: "PRB02",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-015_r1.jpg",
    },
    {
      id: "EB01-015_p1",
      artId: "EB01-015_p1",
      setCode: "PRB02",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-015_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-015_p1.jpg",
      imageId: "EB01-015_p1",
    },
  ],
  i18n: prb02ScratchmenApooEb01015Reprint015I18n,
};
