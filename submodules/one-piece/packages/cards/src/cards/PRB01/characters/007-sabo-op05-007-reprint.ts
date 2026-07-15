import type { CharacterCard } from "@tcg/op-types";
import { op05Sabo007 } from "../../OP05/characters/007-sabo.ts";
import { prb01SaboOp05007Reprint007I18n } from "./007-sabo-op05-007-reprint.i18n.ts";

export const prb01SaboOp05007Reprint007: CharacterCard = {
  ...op05Sabo007,
  id: "OP05-007_r1",
  slug: "sabo-op05-007-reprint",
  name: "Sabo (OP05-007) (Reprint)",
  printings: [
    {
      id: "OP05-007_r1",
      artId: "OP05-007_r1",
      setCode: "PRB01",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_r1.jpg",
    },
    {
      id: "OP05-007_p3",
      artId: "OP05-007_p3",
      setCode: "PRB01",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_p3.jpg",
      imageId: "OP05-007_p3",
    },
  ],
  i18n: prb01SaboOp05007Reprint007I18n,
};
