import type { EventCard } from "@tcg/op-types";
import { op04Barrier095 } from "../../OP04/events/095-barrier.ts";
import { prb01BarrierJollyRogerFoil095I18n } from "./095-barrier-jolly-roger-foil.i18n.ts";

export const prb01BarrierJollyRogerFoil095: EventCard = {
  ...op04Barrier095,
  id: "OP04-095_p2",
  slug: "barrier-jolly-roger-foil",
  name: "Barrier!! (Jolly Roger Foil)",
  printings: [
    {
      id: "OP04-095_p2",
      artId: "OP04-095_p2",
      setCode: "PRB01",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_p2.jpg",
    },
    {
      id: "OP04-095_p3",
      artId: "OP04-095_p3",
      setCode: "PRB01",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_p3.jpg",
    },
    {
      id: "OP04-095_r1",
      artId: "OP04-095_r1",
      setCode: "PRB01",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_r1.png",
    },
  ],
  rarity: "C",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_p3.jpg",
      imageId: "OP04-095_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095_r1.png",
      imageId: "OP04-095_r1",
    },
  ],
  i18n: prb01BarrierJollyRogerFoil095I18n,
};
