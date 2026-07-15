import type { CharacterCard } from "@tcg/op-types";
import { op04Sabo083 } from "../../OP04/characters/083-sabo.ts";
import { prb02SaboOp04083Reprint083I18n } from "./083-sabo-op04-083-reprint.i18n.ts";

export const prb02SaboOp04083Reprint083: CharacterCard = {
  ...op04Sabo083,
  id: "OP04-083_r3",
  slug: "sabo-op04-083-reprint",
  name: "Sabo - OP04-083 (Reprint)",
  printings: [
    {
      id: "OP04-083_r3",
      artId: "OP04-083_r3",
      setCode: "PRB02",
      collectorNumber: "083",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-083_r3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SaboOp04083Reprint083I18n,
};
