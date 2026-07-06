import type { CharacterCard } from "@tcg/op-types";
import { op04Kaido044 } from "../../OP04/characters/044-kaido.ts";
import { prb01KaidoOp04044Reprint044I18n } from "./044-kaido-op04-044-reprint.i18n.ts";

export const prb01KaidoOp04044Reprint044: CharacterCard = {
  ...op04Kaido044,
  id: "OP04-044_r1",
  slug: "kaido-op04-044-reprint",
  name: "Kaido (OP04-044) (Reprint)",
  printings: [
    {
      id: "OP04-044_r1",
      artId: "OP04-044_r1",
      setCode: "PRB01",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_r1.jpg",
    },
    {
      id: "OP04-044_p4",
      artId: "OP04-044_p4",
      setCode: "PRB01",
      collectorNumber: "044",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-044_p4.jpg",
      imageId: "OP04-044_p4",
    },
  ],
  i18n: prb01KaidoOp04044Reprint044I18n,
};
