import type { CharacterCard } from "@tcg/op-types";
import { op10EdwardNewgateSp002 } from "../../OP10/characters/002-edward-newgate-sp.ts";
import { prb02EdwardNewgateSt15002Reprint002I18n } from "./002-edward-newgate-st15-002-reprint.i18n.ts";

export const prb02EdwardNewgateSt15002Reprint002: CharacterCard = {
  ...op10EdwardNewgateSp002,
  id: "ST15-002_r1",
  slug: "edward-newgate-st15-002-reprint",
  name: "Edward.Newgate - ST15-002 (Reprint)",
  printings: [
    {
      id: "ST15-002_r1",
      artId: "ST15-002_r1",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST15-002_r1.jpg",
    },
    {
      id: "ST15-002_p2",
      artId: "ST15-002_p2",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST15-002_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST15-002_p2.jpg",
      imageId: "ST15-002_p2",
    },
  ],
  i18n: prb02EdwardNewgateSt15002Reprint002I18n,
};
