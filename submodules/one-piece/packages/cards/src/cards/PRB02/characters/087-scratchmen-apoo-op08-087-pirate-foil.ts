import type { CharacterCard } from "@tcg/op-types";
import { op08ScratchmenApoo087 } from "../../OP08/characters/087-scratchmen-apoo.ts";
import { prb02ScratchmenApooOp08087PirateFoil087I18n } from "./087-scratchmen-apoo-op08-087-pirate-foil.i18n.ts";

export const prb02ScratchmenApooOp08087PirateFoil087: CharacterCard = {
  ...op08ScratchmenApoo087,
  id: "OP08-087_p1",
  slug: "scratchmen-apoo-op08-087-pirate-foil",
  name: "Scratchmen Apoo - OP08-087 (Pirate Foil)",
  printings: [
    {
      id: "OP08-087_p1",
      artId: "OP08-087_p1",
      setCode: "PRB02",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-087_p1.jpg",
    },
    {
      id: "OP08-087_r1",
      artId: "OP08-087_r1",
      setCode: "PRB02",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-087_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-087_r1.jpg",
      imageId: "OP08-087_r1",
    },
  ],
  i18n: prb02ScratchmenApooOp08087PirateFoil087I18n,
};
