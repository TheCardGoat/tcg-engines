import type { CharacterCard } from "@tcg/op-types";
import { op10XDrake114 } from "../../OP10/characters/114-x-drake.ts";
import { prb02XDrakePirateFoil114I18n } from "./114-x-drake-pirate-foil.i18n.ts";

export const prb02XDrakePirateFoil114: CharacterCard = {
  ...op10XDrake114,
  id: "OP10-114_p1",
  slug: "x-drake-pirate-foil",
  name: "X.Drake (Pirate Foil)",
  printings: [
    {
      id: "OP10-114_p1",
      artId: "OP10-114_p1",
      setCode: "PRB02",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-114_p1.jpg",
    },
    {
      id: "OP10-114_r1",
      artId: "OP10-114_r1",
      setCode: "PRB02",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-114_r1.jpg",
    },
    {
      id: "OP10-114_p2",
      artId: "OP10-114_p2",
      setCode: "PRB02",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-114_p2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-114_r1.jpg",
      imageId: "OP10-114_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-114_p2.jpg",
      imageId: "OP10-114_p2",
    },
  ],
  i18n: prb02XDrakePirateFoil114I18n,
};
