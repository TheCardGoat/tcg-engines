import type { CharacterCard } from "@tcg/op-types";
import { op09Franky072 } from "../../OP09/characters/072-franky.ts";
import { prb02FrankyOp09072Reprint072I18n } from "./072-franky-op09-072-reprint.i18n.ts";

export const prb02FrankyOp09072Reprint072: CharacterCard = {
  ...op09Franky072,
  id: "OP09-072_r1",
  slug: "franky-op09-072-reprint",
  name: "Franky - OP09-072 (Reprint)",
  printings: [
    {
      id: "OP09-072_r1",
      artId: "OP09-072_r1",
      setCode: "PRB02",
      collectorNumber: "072",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-072_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02FrankyOp09072Reprint072I18n,
};
