import type { CharacterCard } from "@tcg/op-types";
import { op09RoronoaZoro076 } from "../../OP09/characters/076-roronoa-zoro.ts";
import { prb02RoronoaZoroOp09076076I18n } from "./076-roronoa-zoro-op09-076.i18n.ts";

export const prb02RoronoaZoroOp09076076: CharacterCard = {
  ...op09RoronoaZoro076,
  id: "OP09-076_r2",
  slug: "roronoa-zoro-op09-076",
  name: "Roronoa Zoro - OP09-076",
  printings: [
    {
      id: "OP09-076_r2",
      artId: "OP09-076_r2",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-076_r2.jpg",
    },
    {
      id: "OP09-076_p2",
      artId: "OP09-076_p2",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-076_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-076_p2.jpg",
      imageId: "OP09-076_p2",
    },
  ],
  i18n: prb02RoronoaZoroOp09076076I18n,
};
