import type { CharacterCard } from "@tcg/op-types";
import { op10Tashigi032 } from "../../OP10/characters/032-tashigi.ts";
import { prb02TashigiReprint032I18n } from "./032-tashigi-reprint.i18n.ts";

export const prb02TashigiReprint032: CharacterCard = {
  ...op10Tashigi032,
  id: "OP10-032_r1",
  slug: "tashigi-reprint",
  name: "Tashigi (Reprint)",
  printings: [
    {
      id: "OP10-032_r1",
      artId: "OP10-032_r1",
      setCode: "PRB02",
      collectorNumber: "032",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-032_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02TashigiReprint032I18n,
};
