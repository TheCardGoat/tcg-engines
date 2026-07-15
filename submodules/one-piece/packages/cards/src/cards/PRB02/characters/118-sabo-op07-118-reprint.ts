import type { CharacterCard } from "@tcg/op-types";
import { op07Sabo118 } from "../../OP07/characters/118-sabo.ts";
import { prb02SaboOp07118Reprint118I18n } from "./118-sabo-op07-118-reprint.i18n.ts";

export const prb02SaboOp07118Reprint118: CharacterCard = {
  ...op07Sabo118,
  id: "OP07-118_r1",
  slug: "sabo-op07-118-reprint",
  name: "Sabo - OP07-118 (Reprint)",
  printings: [
    {
      id: "OP07-118_r1",
      artId: "OP07-118_r1",
      setCode: "PRB02",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-118_r1.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SaboOp07118Reprint118I18n,
};
