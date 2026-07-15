import type { CharacterCard } from "@tcg/op-types";
import { op01Shanks120 } from "../../OP01/characters/120-shanks.ts";
import { prb01ShanksOp01120Reprint120I18n } from "./120-shanks-op01-120-reprint.i18n.ts";

export const prb01ShanksOp01120Reprint120: CharacterCard = {
  ...op01Shanks120,
  id: "OP01-120_p7",
  slug: "shanks-op01-120-reprint",
  name: "Shanks (OP01-120) (Reprint)",
  printings: [
    {
      id: "OP01-120_p7",
      artId: "OP01-120_p7",
      setCode: "PRB01",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p7.jpg",
    },
    {
      id: "OP01-120_r2",
      artId: "OP01-120_r2",
      setCode: "PRB01",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_r2.jpg",
    },
    {
      id: "OP01-120_p5",
      artId: "OP01-120_p5",
      setCode: "PRB01",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p5.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_r2.jpg",
      imageId: "OP01-120_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p5.jpg",
      imageId: "OP01-120_p5",
    },
  ],
  i18n: prb01ShanksOp01120Reprint120I18n,
};
