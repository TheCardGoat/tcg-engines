import type { CharacterCard } from "@tcg/op-types";
import { op04Sabo083 } from "../../OP04/characters/083-sabo.ts";
import { prb01SaboOp04083Manga083I18n } from "./083-sabo-op04-083-manga.i18n.ts";

export const prb01SaboOp04083Manga083: CharacterCard = {
  ...op04Sabo083,
  id: "OP04-083_r1",
  slug: "sabo-op04-083-manga",
  name: "Sabo (OP04-083) (Manga)",
  printings: [
    {
      id: "OP04-083_r1",
      artId: "OP04-083_r1",
      setCode: "PRB01",
      collectorNumber: "083",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-083_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01SaboOp04083Manga083I18n,
};
