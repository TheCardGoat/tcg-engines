import type { CharacterCard } from "@tcg/op-types";
import { op10ScratchmenApoo108 } from "../../OP10/characters/108-scratchmen-apoo.ts";
import { prb02ScratchmenApooOp10108PirateFoil108I18n } from "./108-scratchmen-apoo-op10-108-pirate-foil.i18n.ts";

export const prb02ScratchmenApooOp10108PirateFoil108: CharacterCard = {
  ...op10ScratchmenApoo108,
  id: "OP10-108_p1",
  slug: "scratchmen-apoo-op10-108-pirate-foil",
  name: "Scratchmen Apoo - OP10-108 (Pirate Foil)",
  printings: [
    {
      id: "OP10-108_p1",
      artId: "OP10-108_p1",
      setCode: "PRB02",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-108_p1.jpg",
    },
    {
      id: "OP10-108_r1",
      artId: "OP10-108_r1",
      setCode: "PRB02",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-108_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-108_r1.jpg",
      imageId: "OP10-108_r1",
    },
  ],
  i18n: prb02ScratchmenApooOp10108PirateFoil108I18n,
};
