import type { CharacterCard } from "@tcg/op-types";
import { op04Sanji104 } from "../../OP04/characters/104-sanji.ts";
import { prb01SanjiReprint104I18n } from "./104-sanji-reprint.i18n.ts";

export const prb01SanjiReprint104: CharacterCard = {
  ...op04Sanji104,
  id: "OP04-104_r1",
  slug: "sanji-reprint/op04-104",
  name: "Sanji (Reprint)",
  printings: [
    {
      id: "OP04-104_r1",
      artId: "OP04-104_r1",
      setCode: "PRB01",
      collectorNumber: "104",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-104_r1.jpg",
    },
    {
      id: "OP04-104_p3",
      artId: "OP04-104_p3",
      setCode: "PRB01",
      collectorNumber: "104",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-104_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-104_p3.jpg",
      imageId: "OP04-104_p3",
    },
  ],
  i18n: prb01SanjiReprint104I18n,
};
