import type { EventCard } from "@tcg/op-types";
import { st01GuardPoint014 } from "../../ST01/index.ts";
import { prb01GuardPointJollyRogerFoil014I18n } from "./014-guard-point-jolly-roger-foil.i18n.ts";

export const prb01GuardPointJollyRogerFoil014: EventCard = {
  ...st01GuardPoint014,
  id: "ST01-014_p2",
  slug: "guard-point-jolly-roger-foil",
  name: "Guard Point (Jolly Roger Foil)",
  printings: [
    {
      id: "ST01-014_p2",
      artId: "ST01-014_p2",
      setCode: "PRB01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_p2.jpg",
    },
    {
      id: "ST01-014_p3",
      artId: "ST01-014_p3",
      setCode: "PRB01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_p3.jpg",
    },
    {
      id: "ST01-014_r1",
      artId: "ST01-014_r1",
      setCode: "PRB01",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_p3.jpg",
      imageId: "ST01-014_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_r1.png",
      imageId: "ST01-014_r1",
    },
  ],
  i18n: prb01GuardPointJollyRogerFoil014I18n,
};
