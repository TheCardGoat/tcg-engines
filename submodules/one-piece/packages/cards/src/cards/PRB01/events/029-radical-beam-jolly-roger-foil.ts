import type { EventCard } from "@tcg/op-types";
import { op01RadicalBeam029 } from "../../OP01/events/029-radical-beam.ts";
import { prb01RadicalBeamJollyRogerFoil029I18n } from "./029-radical-beam-jolly-roger-foil.i18n.ts";

export const prb01RadicalBeamJollyRogerFoil029: EventCard = {
  ...op01RadicalBeam029,
  id: "OP01-029_p2",
  slug: "radical-beam-jolly-roger-foil",
  name: "Radical Beam!! (Jolly Roger Foil)",
  printings: [
    {
      id: "OP01-029_p2",
      artId: "OP01-029_p2",
      setCode: "PRB01",
      collectorNumber: "029",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_p2.jpg",
    },
    {
      id: "OP01-029_p3",
      artId: "OP01-029_p3",
      setCode: "PRB01",
      collectorNumber: "029",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_p3.jpg",
    },
    {
      id: "OP01-029_r1",
      artId: "OP01-029_r1",
      setCode: "PRB01",
      collectorNumber: "029",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_p3.jpg",
      imageId: "OP01-029_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_r1.png",
      imageId: "OP01-029_r1",
    },
  ],
  i18n: prb01RadicalBeamJollyRogerFoil029I18n,
};
