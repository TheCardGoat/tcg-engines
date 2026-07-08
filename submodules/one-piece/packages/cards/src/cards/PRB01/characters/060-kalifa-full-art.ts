import type { CharacterCard } from "@tcg/op-types";
import { op03Kalifa060 } from "../../OP03/characters/060-kalifa.ts";
import { prb01KalifaFullArt060I18n } from "./060-kalifa-full-art.i18n.ts";

export const prb01KalifaFullArt060: CharacterCard = {
  ...op03Kalifa060,
  id: "OP03-060_p3",
  slug: "kalifa-full-art",
  name: "Kalifa (Full Art)",
  printings: [
    {
      id: "OP03-060_p3",
      artId: "OP03-060_p3",
      setCode: "PRB01",
      collectorNumber: "060",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_p3.jpg",
    },
    {
      id: "OP03-060_r1",
      artId: "OP03-060_r1",
      setCode: "PRB01",
      collectorNumber: "060",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_r1.jpg",
    },
    {
      id: "OP03-060_p2",
      artId: "OP03-060_p2",
      setCode: "PRB01",
      collectorNumber: "060",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_p2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_r1.jpg",
      imageId: "OP03-060_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_p2.jpg",
      imageId: "OP03-060_p2",
    },
  ],
  i18n: prb01KalifaFullArt060I18n,
};
