import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy109 } from "../../OP07/characters/109-monkey-d-luffy.ts";
import { prb02MonkeyDLuffyOp07109Reprint109I18n } from "./109-monkey-d-luffy-op07-109-reprint.i18n.ts";

export const prb02MonkeyDLuffyOp07109Reprint109: CharacterCard = {
  ...op07MonkeyDLuffy109,
  id: "OP07-109_r1",
  slug: "monkey-d-luffy-op07-109-reprint",
  name: "Monkey.D.Luffy - OP07-109 (Reprint)",
  printings: [
    {
      id: "OP07-109_r1",
      artId: "OP07-109_r1",
      setCode: "PRB02",
      collectorNumber: "109",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-109_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02MonkeyDLuffyOp07109Reprint109I18n,
};
