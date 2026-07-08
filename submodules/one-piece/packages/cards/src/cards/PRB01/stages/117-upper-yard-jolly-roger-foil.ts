import type { StageCard } from "@tcg/op-types";
import { op05UpperYard117 } from "../../OP05/stages/117-upper-yard.ts";
import { prb01UpperYardJollyRogerFoil117I18n } from "./117-upper-yard-jolly-roger-foil.i18n.ts";

export const prb01UpperYardJollyRogerFoil117: StageCard = {
  ...op05UpperYard117,
  id: "OP05-117_p2",
  slug: "upper-yard-jolly-roger-foil",
  name: "Upper Yard (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-117_p2",
      artId: "OP05-117_p2",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p2.jpg",
    },
    {
      id: "OP05-117_p3",
      artId: "OP05-117_p3",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p3.jpg",
    },
    {
      id: "OP05-117_r1",
      artId: "OP05-117_r1",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_r1.png",
    },
    {
      id: "OP05-117_p4",
      artId: "OP05-117_p4",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p4.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p3.jpg",
      imageId: "OP05-117_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_r1.png",
      imageId: "OP05-117_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p4.jpg",
      imageId: "OP05-117_p4",
    },
  ],
  i18n: prb01UpperYardJollyRogerFoil117I18n,
};
