import type { EventCard } from "@tcg/op-types";
import { op04GumGumRedRoc056 } from "../../OP04/events/056-gum-gum-red-roc.ts";
import { prb01GumGumRedRocJollyRogerFoil056I18n } from "./056-gum-gum-red-roc-jolly-roger-foil.i18n.ts";

export const prb01GumGumRedRocJollyRogerFoil056: EventCard = {
  ...op04GumGumRedRoc056,
  id: "OP04-056_p2_6KicMKv",
  slug: "gum-gum-red-roc-jolly-roger-foil",
  name: "Gum-Gum Red Roc (Jolly Roger Foil)",
  printings: [
    {
      id: "OP04-056_p2_6KicMKv",
      artId: "OP04-056_p2_6KicMKv",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p2_6KicMKv.jpg",
    },
    {
      id: "OP04-056_p3",
      artId: "OP04-056_p3",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p3.jpg",
    },
    {
      id: "OP04-056_r1",
      artId: "OP04-056_r1",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_r1.png",
    },
    {
      id: "OP04-056_p2",
      artId: "OP04-056_p2",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p3.jpg",
      imageId: "OP04-056_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_r1.png",
      imageId: "OP04-056_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p2.jpg",
      imageId: "OP04-056_p2",
    },
  ],
  i18n: prb01GumGumRedRocJollyRogerFoil056I18n,
};
