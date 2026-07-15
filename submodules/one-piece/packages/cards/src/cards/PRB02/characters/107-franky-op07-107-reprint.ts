import type { CharacterCard } from "@tcg/op-types";
import { op07Franky107 } from "../../OP07/characters/107-franky.ts";
import { prb02FrankyOp07107Reprint107I18n } from "./107-franky-op07-107-reprint.i18n.ts";

export const prb02FrankyOp07107Reprint107: CharacterCard = {
  ...op07Franky107,
  id: "OP07-107_r1",
  slug: "franky-op07-107-reprint",
  name: "Franky - OP07-107 (Reprint)",
  printings: [
    {
      id: "OP07-107_r1",
      artId: "OP07-107_r1",
      setCode: "PRB02",
      collectorNumber: "107",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-107_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02FrankyOp07107Reprint107I18n,
};
