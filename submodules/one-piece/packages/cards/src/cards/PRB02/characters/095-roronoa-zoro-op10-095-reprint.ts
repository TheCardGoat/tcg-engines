import type { CharacterCard } from "@tcg/op-types";
import { op10RoronoaZoro095 } from "../../OP10/characters/095-roronoa-zoro.ts";
import { prb02RoronoaZoroOp10095Reprint095I18n } from "./095-roronoa-zoro-op10-095-reprint.i18n.ts";

export const prb02RoronoaZoroOp10095Reprint095: CharacterCard = {
  ...op10RoronoaZoro095,
  id: "OP10-095_r1",
  slug: "roronoa-zoro-op10-095-reprint",
  name: "Roronoa Zoro - OP10-095 (Reprint)",
  printings: [
    {
      id: "OP10-095_r1",
      artId: "OP10-095_r1",
      setCode: "PRB02",
      collectorNumber: "095",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095_r1.jpg",
    },
    {
      id: "OP10-095_p1",
      artId: "OP10-095_p1",
      setCode: "PRB02",
      collectorNumber: "095",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-095_p1.jpg",
      imageId: "OP10-095_p1",
    },
  ],
  i18n: prb02RoronoaZoroOp10095Reprint095I18n,
};
