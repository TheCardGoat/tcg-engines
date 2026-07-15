import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteSmoothie110 } from "../../OP03/characters/110-charlotte-smoothie.ts";
import { prb01CharlotteSmoothieFullArt110I18n } from "./110-charlotte-smoothie-full-art.i18n.ts";

export const prb01CharlotteSmoothieFullArt110: CharacterCard = {
  ...op03CharlotteSmoothie110,
  id: "OP03-110_p4",
  slug: "charlotte-smoothie-full-art",
  name: "Charlotte Smoothie (Full Art)",
  printings: [
    {
      id: "OP03-110_p4",
      artId: "OP03-110_p4",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p4.jpg",
    },
    {
      id: "OP03-110_p3",
      artId: "OP03-110_p3",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p3.jpg",
    },
    {
      id: "OP03-110_r2",
      artId: "OP03-110_r2",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_r2.jpg",
    },
    {
      id: "OP03-110_p5",
      artId: "OP03-110_p5",
      setCode: "PRB01",
      collectorNumber: "110",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p5.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p3.jpg",
      imageId: "OP03-110_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_r2.jpg",
      imageId: "OP03-110_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p5.jpg",
      imageId: "OP03-110_p5",
    },
  ],
  i18n: prb01CharlotteSmoothieFullArt110I18n,
};
