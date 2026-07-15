import type { EventCard } from "@tcg/op-types";
import { op05ElThor114 } from "../../OP05/events/114-el-thor.ts";
import { prb01ElThorJollyRogerFoil114I18n } from "./114-el-thor-jolly-roger-foil.i18n.ts";

export const prb01ElThorJollyRogerFoil114: EventCard = {
  ...op05ElThor114,
  id: "OP05-114_p2",
  slug: "el-thor-jolly-roger-foil",
  name: "El Thor (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-114_p2",
      artId: "OP05-114_p2",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p2.jpg",
    },
    {
      id: "OP05-114_p3",
      artId: "OP05-114_p3",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p3.jpg",
    },
    {
      id: "OP05-114_p2",
      artId: "OP05-114_p2",
      setCode: "PRB01",
      collectorNumber: "114",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p2.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p3.jpg",
      imageId: "OP05-114_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p2.png",
      imageId: "OP05-114_p2",
    },
  ],
  i18n: prb01ElThorJollyRogerFoil114I18n,
};
