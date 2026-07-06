import type { CharacterCard } from "@tcg/op-types";
import { op04Yamato112 } from "../../OP04/characters/112-yamato.ts";
import { prb01YamatoOp04112Reprint112I18n } from "./112-yamato-op04-112-reprint.i18n.ts";

export const prb01YamatoOp04112Reprint112: CharacterCard = {
  ...op04Yamato112,
  id: "OP04-112_r1",
  slug: "yamato-op04-112-reprint",
  name: "Yamato (OP04-112) (Reprint)",
  printings: [
    {
      id: "OP04-112_r1",
      artId: "OP04-112_r1",
      setCode: "PRB01",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_r1.jpg",
    },
    {
      id: "OP04-112_p3",
      artId: "OP04-112_p3",
      setCode: "PRB01",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_p3.jpg",
      imageId: "OP04-112_p3",
    },
  ],
  i18n: prb01YamatoOp04112Reprint112I18n,
};
