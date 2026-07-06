import type { CharacterCard } from "@tcg/op-types";
import { op02Kuzan096 } from "../../OP02/characters/096-kuzan.ts";
import { prb01KuzanOp02096Reprint096I18n } from "./096-kuzan-op02-096-reprint.i18n.ts";

export const prb01KuzanOp02096Reprint096: CharacterCard = {
  ...op02Kuzan096,
  id: "OP02-096_r1",
  slug: "kuzan-op02-096-reprint",
  name: "Kuzan (OP02-096) (Reprint)",
  printings: [
    {
      id: "OP02-096_r1",
      artId: "OP02-096_r1",
      setCode: "PRB01",
      collectorNumber: "096",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096_r1.jpg",
    },
    {
      id: "OP02-096_p3",
      artId: "OP02-096_p3",
      setCode: "PRB01",
      collectorNumber: "096",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096_p3.jpg",
      imageId: "OP02-096_p3",
    },
  ],
  i18n: prb01KuzanOp02096Reprint096I18n,
};
