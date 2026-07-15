import type { CharacterCard } from "@tcg/op-types";
import { op05Shirahoshi082 } from "../../OP05/characters/082-shirahoshi.ts";
import { prb01ShirahoshiOp05082JollyRogerFoil082I18n } from "./082-shirahoshi-op05-082-jolly-roger-foil.i18n.ts";

export const prb01ShirahoshiOp05082JollyRogerFoil082: CharacterCard = {
  ...op05Shirahoshi082,
  id: "OP05-082_p2",
  slug: "shirahoshi-op05-082-jolly-roger-foil",
  name: "Shirahoshi (OP05-082) (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-082_p2",
      artId: "OP05-082_p2",
      setCode: "PRB01",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p2.jpg",
    },
    {
      id: "OP05-082_r1",
      artId: "OP05-082_r1",
      setCode: "PRB01",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_r1.jpg",
    },
    {
      id: "OP05-082_p3",
      artId: "OP05-082_p3",
      setCode: "PRB01",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p3.jpg",
    },
    {
      id: "OP05-082_p4",
      artId: "OP05-082_p4",
      setCode: "PRB01",
      collectorNumber: "082",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_r1.jpg",
      imageId: "OP05-082_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p3.jpg",
      imageId: "OP05-082_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p4.jpg",
      imageId: "OP05-082_p4",
    },
  ],
  i18n: prb01ShirahoshiOp05082JollyRogerFoil082I18n,
};
