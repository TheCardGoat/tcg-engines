import type { CharacterCard } from "@tcg/op-types";
import { op07TrafalgarLawTr010 } from "../../OP07/characters/010-trafalgar-law-tr.ts";
import { prb01TrafalgarLawSt10010Reprint010I18n } from "./010-trafalgar-law-st10-010-reprint.i18n.ts";

export const prb01TrafalgarLawSt10010Reprint010: CharacterCard = {
  ...op07TrafalgarLawTr010,
  id: "ST10-010_p7",
  slug: "trafalgar-law-st10-010-reprint",
  name: "Trafalgar Law (ST10-010) (Reprint)",
  printings: [
    {
      id: "ST10-010_p7",
      artId: "ST10-010_p7",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-010_p7.jpg",
    },
    {
      id: "ST10-010_p4",
      artId: "ST10-010_p4",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-010_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST10-010_p4.jpg",
      imageId: "ST10-010_p4",
    },
  ],
  i18n: prb01TrafalgarLawSt10010Reprint010I18n,
};
