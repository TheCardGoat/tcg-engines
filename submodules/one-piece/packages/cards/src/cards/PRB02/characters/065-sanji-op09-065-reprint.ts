import type { CharacterCard } from "@tcg/op-types";
import { op09Sanji065 } from "../../OP09/characters/065-sanji.ts";
import { prb02SanjiOp09065Reprint065I18n } from "./065-sanji-op09-065-reprint.i18n.ts";

export const prb02SanjiOp09065Reprint065: CharacterCard = {
  ...op09Sanji065,
  id: "OP09-065_r1",
  slug: "sanji-op09-065-reprint",
  name: "Sanji - OP09-065 (Reprint)",
  printings: [
    {
      id: "OP09-065_r1",
      artId: "OP09-065_r1",
      setCode: "PRB02",
      collectorNumber: "065",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-065_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SanjiOp09065Reprint065I18n,
};
