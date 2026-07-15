import type { CharacterCard } from "@tcg/op-types";
import { op10TrafalgarLaw119 } from "../../OP10/characters/119-trafalgar-law.ts";
import { prb02TrafalgarLawOp10119Reprint119I18n } from "./119-trafalgar-law-op10-119-reprint.i18n.ts";

export const prb02TrafalgarLawOp10119Reprint119: CharacterCard = {
  ...op10TrafalgarLaw119,
  id: "OP10-119_r1",
  slug: "trafalgar-law-op10-119-reprint",
  name: "Trafalgar Law - OP10-119 (Reprint)",
  printings: [
    {
      id: "OP10-119_r1",
      artId: "OP10-119_r1",
      setCode: "PRB02",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-119_r1.jpg",
    },
    {
      id: "OP10-119_p1",
      artId: "OP10-119_p1",
      setCode: "PRB02",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-119_p1_sEtXfvx.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-119_p1_sEtXfvx.jpg",
      imageId: "OP10-119_p1",
    },
  ],
  i18n: prb02TrafalgarLawOp10119Reprint119I18n,
};
