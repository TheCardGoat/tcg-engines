import type { CharacterCard } from "@tcg/op-types";
import { op05Rebecca091 } from "../../OP05/characters/091-rebecca.ts";
import { prb02RebeccaReprint091I18n } from "./091-rebecca-reprint.i18n.ts";

export const prb02RebeccaReprint091: CharacterCard = {
  ...op05Rebecca091,
  id: "OP05-091_r1",
  slug: "rebecca-reprint",
  name: "Rebecca (Reprint)",
  printings: [
    {
      id: "OP05-091_r1",
      artId: "OP05-091_r1",
      setCode: "PRB02",
      collectorNumber: "091",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-091_r1.jpg",
    },
    {
      id: "OP05-091_p1",
      artId: "OP05-091_p1",
      setCode: "PRB02",
      collectorNumber: "091",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-091_p1_LMalLg1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-091_p1_LMalLg1.jpg",
      imageId: "OP05-091_p1",
    },
  ],
  i18n: prb02RebeccaReprint091I18n,
};
