import type { CharacterCard } from "@tcg/op-types";
import { op05Gedatsu102 } from "../../OP05/characters/102-gedatsu.ts";
import { prb02GedatsuReprint102I18n } from "./102-gedatsu-reprint.i18n.ts";

export const prb02GedatsuReprint102: CharacterCard = {
  ...op05Gedatsu102,
  id: "OP05-102_r1",
  slug: "gedatsu-reprint",
  name: "Gedatsu (Reprint)",
  printings: [
    {
      id: "OP05-102_r1",
      artId: "OP05-102_r1",
      setCode: "PRB02",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-102_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02GedatsuReprint102I18n,
};
