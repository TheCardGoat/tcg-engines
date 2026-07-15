import type { CharacterCard } from "@tcg/op-types";
import { op06Sanji119 } from "../../OP06/characters/119-sanji.ts";
import { prb02SanjiOp06119Reprint119I18n } from "./119-sanji-op06-119-reprint.i18n.ts";

export const prb02SanjiOp06119Reprint119: CharacterCard = {
  ...op06Sanji119,
  id: "OP06-119_r1_9ikPecz",
  slug: "sanji-op06-119-reprint",
  name: "Sanji - OP06-119 (Reprint)",
  printings: [
    {
      id: "OP06-119_r1_9ikPecz",
      artId: "OP06-119_r1_9ikPecz",
      setCode: "PRB02",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-119_r1_9ikPecz.jpg",
    },
    {
      id: "OP06-119_p3",
      artId: "OP06-119_p3",
      setCode: "PRB02",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-119_p3.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-119_p3.jpg",
      imageId: "OP06-119_p3",
    },
  ],
  i18n: prb02SanjiOp06119Reprint119I18n,
};
