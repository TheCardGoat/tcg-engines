import type { CharacterCard } from "@tcg/op-types";
import { op02Kuzan121 } from "../../OP02/characters/121-kuzan.ts";
import { prb01KuzanOp02121Reprint121I18n } from "./121-kuzan-op02-121-reprint.i18n.ts";

export const prb01KuzanOp02121Reprint121: CharacterCard = {
  ...op02Kuzan121,
  id: "OP02-121_r1",
  slug: "kuzan-op02-121-reprint",
  name: "Kuzan (OP02-121) (Reprint)",
  printings: [
    {
      id: "OP02-121_r1",
      artId: "OP02-121_r1",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-121_r1.jpg",
    },
    {
      id: "OP02-121_p3",
      artId: "OP02-121_p3",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-121_p3.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-121_p3.jpg",
      imageId: "OP02-121_p3",
    },
  ],
  i18n: prb01KuzanOp02121Reprint121I18n,
};
