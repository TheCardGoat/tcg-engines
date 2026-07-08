import type { EventCard } from "@tcg/op-types";
import { op03SanjiSPilaf056 } from "../../OP03/events/056-sanji-s-pilaf.ts";
import { prb01SanjiSPilafJollyRogerFoil056I18n } from "./056-sanji-s-pilaf-jolly-roger-foil.i18n.ts";

export const prb01SanjiSPilafJollyRogerFoil056: EventCard = {
  ...op03SanjiSPilaf056,
  id: "OP03-056_p2",
  slug: "sanji-s-pilaf-jolly-roger-foil",
  name: "Sanji's Pilaf (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-056_p2",
      artId: "OP03-056_p2",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p2.jpg",
    },
    {
      id: "OP03-056_p3",
      artId: "OP03-056_p3",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p3.jpg",
    },
    {
      id: "OP03-056_r1",
      artId: "OP03-056_r1",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_r1.png",
    },
    {
      id: "OP03-056_p4",
      artId: "OP03-056_p4",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p4.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p3.jpg",
      imageId: "OP03-056_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_r1.png",
      imageId: "OP03-056_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-056_p4.jpg",
      imageId: "OP03-056_p4",
    },
  ],
  i18n: prb01SanjiSPilafJollyRogerFoil056I18n,
};
