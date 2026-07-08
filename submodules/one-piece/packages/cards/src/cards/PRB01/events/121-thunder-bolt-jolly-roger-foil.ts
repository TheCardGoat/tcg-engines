import type { EventCard } from "@tcg/op-types";
import { op03ThunderBolt121 } from "../../OP03/events/121-thunder-bolt.ts";
import { prb01ThunderBoltJollyRogerFoil121I18n } from "./121-thunder-bolt-jolly-roger-foil.i18n.ts";

export const prb01ThunderBoltJollyRogerFoil121: EventCard = {
  ...op03ThunderBolt121,
  id: "OP03-121_p3",
  slug: "thunder-bolt-jolly-roger-foil",
  name: "Thunder Bolt (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-121_p3",
      artId: "OP03-121_p3",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_p3.jpg",
    },
    {
      id: "OP03-121_p4",
      artId: "OP03-121_p4",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_p4.jpg",
    },
    {
      id: "OP03-121_r2",
      artId: "OP03-121_r2",
      setCode: "PRB01",
      collectorNumber: "121",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_r2.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_p4.jpg",
      imageId: "OP03-121_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_r2.png",
      imageId: "OP03-121_r2",
    },
  ],
  i18n: prb01ThunderBoltJollyRogerFoil121I18n,
};
