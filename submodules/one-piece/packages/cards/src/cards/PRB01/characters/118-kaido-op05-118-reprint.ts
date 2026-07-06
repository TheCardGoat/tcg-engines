import type { CharacterCard } from "@tcg/op-types";
import { op05Kaido118 } from "../../OP05/characters/118-kaido.ts";
import { prb01KaidoOp05118Reprint118I18n } from "./118-kaido-op05-118-reprint.i18n.ts";

export const prb01KaidoOp05118Reprint118: CharacterCard = {
  ...op05Kaido118,
  id: "OP05-118_r1",
  slug: "kaido-op05-118-reprint",
  name: "Kaido (OP05-118) (Reprint)",
  printings: [
    {
      id: "OP05-118_r1",
      artId: "OP05-118_r1",
      setCode: "PRB01",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118_r1.jpg",
    },
    {
      id: "OP05-118_p3",
      artId: "OP05-118_p3",
      setCode: "PRB01",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118_p3.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-118_p3.jpg",
      imageId: "OP05-118_p3",
    },
  ],
  i18n: prb01KaidoOp05118Reprint118I18n,
};
