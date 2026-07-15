import type { StageCard } from "@tcg/op-types";
import { op06KingdomOfGerma079 } from "../../OP06/stages/079-kingdom-of-germa.ts";
import { prb01KingdomOfGermaJollyRogerFoil079I18n } from "./079-kingdom-of-germa-jolly-roger-foil.i18n.ts";

export const prb01KingdomOfGermaJollyRogerFoil079: StageCard = {
  ...op06KingdomOfGerma079,
  id: "OP06-079_p2",
  slug: "kingdom-of-germa-jolly-roger-foil",
  name: "Kingdom of GERMA (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-079_p2",
      artId: "OP06-079_p2",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p2.jpg",
    },
    {
      id: "OP06-079_p3",
      artId: "OP06-079_p3",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p3.jpg",
    },
    {
      id: "OP06-079_r1",
      artId: "OP06-079_r1",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_r1.png",
    },
    {
      id: "OP06-079_p4",
      artId: "OP06-079_p4",
      setCode: "PRB01",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p4.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p3.jpg",
      imageId: "OP06-079_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_r1.png",
      imageId: "OP06-079_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p4.jpg",
      imageId: "OP06-079_p4",
    },
  ],
  i18n: prb01KingdomOfGermaJollyRogerFoil079I18n,
};
