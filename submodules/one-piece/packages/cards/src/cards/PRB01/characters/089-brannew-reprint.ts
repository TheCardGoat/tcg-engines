import type { CharacterCard } from "@tcg/op-types";
import { op03Brannew089 } from "../../OP03/characters/089-brannew.ts";
import { prb01BrannewReprint089I18n } from "./089-brannew-reprint.i18n.ts";

export const prb01BrannewReprint089: CharacterCard = {
  ...op03Brannew089,
  id: "OP03-089_r2",
  slug: "brannew-reprint",
  name: "Brannew (Reprint)",
  printings: [
    {
      id: "OP03-089_r2",
      artId: "OP03-089_r2",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_r2.jpg",
    },
    {
      id: "OP03-089_p4",
      artId: "OP03-089_p4",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p4.jpg",
    },
    {
      id: "OP03-089_p5",
      artId: "OP03-089_p5",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p5.jpg",
    },
    {
      id: "OP03-089_p6",
      artId: "OP03-089_p6",
      setCode: "PRB01",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p6.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p4.jpg",
      imageId: "OP03-089_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p5.jpg",
      imageId: "OP03-089_p5",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p6.jpg",
      imageId: "OP03-089_p6",
    },
  ],
  i18n: prb01BrannewReprint089I18n,
};
