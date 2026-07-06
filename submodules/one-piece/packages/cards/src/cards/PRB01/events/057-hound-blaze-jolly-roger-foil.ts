import type { EventCard } from "@tcg/op-types";
import { op05HoundBlaze057 } from "../../OP05/events/057-hound-blaze.ts";
import { prb01HoundBlazeJollyRogerFoil057I18n } from "./057-hound-blaze-jolly-roger-foil.i18n.ts";

export const prb01HoundBlazeJollyRogerFoil057: EventCard = {
  ...op05HoundBlaze057,
  id: "OP05-057_p2",
  slug: "hound-blaze-jolly-roger-foil",
  name: "Hound Blaze (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-057_p2",
      artId: "OP05-057_p2",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p2.png",
    },
    {
      id: "OP05-057_p3",
      artId: "OP05-057_p3",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p3.jpg",
    },
    {
      id: "OP05-057_r1",
      artId: "OP05-057_r1",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_r1.png",
    },
    {
      id: "OP05-057_p4",
      artId: "OP05-057_p4",
      setCode: "PRB01",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p3.jpg",
      imageId: "OP05-057_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_r1.png",
      imageId: "OP05-057_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p4.jpg",
      imageId: "OP05-057_p4",
    },
  ],
  i18n: prb01HoundBlazeJollyRogerFoil057I18n,
};
