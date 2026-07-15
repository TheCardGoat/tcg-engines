import type { CharacterCard } from "@tcg/op-types";
import { op07Sanji064 } from "../../OP07/characters/064-sanji.ts";
import { prb02SanjiReprint064I18n } from "./064-sanji-reprint.i18n.ts";

export const prb02SanjiReprint064: CharacterCard = {
  ...op07Sanji064,
  id: "OP07-064_r1",
  slug: "sanji-reprint/op07-064",
  name: "Sanji (Reprint)",
  printings: [
    {
      id: "OP07-064_r1",
      artId: "OP07-064_r1",
      setCode: "PRB02",
      collectorNumber: "064",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-064_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SanjiReprint064I18n,
};
