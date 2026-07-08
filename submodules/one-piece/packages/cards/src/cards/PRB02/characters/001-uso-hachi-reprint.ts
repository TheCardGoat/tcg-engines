import type { CharacterCard } from "@tcg/op-types";
import { op10UsoHachiSp001 } from "../../OP10/characters/001-uso-hachi-sp.ts";
import { prb02UsoHachiReprint001I18n } from "./001-uso-hachi-reprint.i18n.ts";

export const prb02UsoHachiReprint001: CharacterCard = {
  ...op10UsoHachiSp001,
  id: "ST18-001_r1",
  slug: "uso-hachi-reprint",
  name: "Uso-Hachi (Reprint)",
  printings: [
    {
      id: "ST18-001_r1",
      artId: "ST18-001_r1",
      setCode: "PRB02",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_r1.jpg",
    },
    {
      id: "ST18-001_p2",
      artId: "ST18-001_p2",
      setCode: "PRB02",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p2.jpg",
    },
    {
      id: "ST18-001_p3",
      artId: "ST18-001_p3",
      setCode: "PRB02",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p3.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p2.jpg",
      imageId: "ST18-001_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-001_p3.jpg",
      imageId: "ST18-001_p3",
    },
  ],
  i18n: prb02UsoHachiReprint001I18n,
};
