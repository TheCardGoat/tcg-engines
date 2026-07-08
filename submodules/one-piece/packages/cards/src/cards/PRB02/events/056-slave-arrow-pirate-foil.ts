import type { EventCard } from "@tcg/op-types";
import { op07SlaveArrow056 } from "../../OP07/events/056-slave-arrow.ts";
import { prb02SlaveArrowPirateFoil056I18n } from "./056-slave-arrow-pirate-foil.i18n.ts";

export const prb02SlaveArrowPirateFoil056: EventCard = {
  ...op07SlaveArrow056,
  id: "OP07-056_p1",
  slug: "slave-arrow-pirate-foil",
  name: "Slave Arrow (Pirate Foil)",
  printings: [
    {
      id: "OP07-056_p1",
      artId: "OP07-056_p1",
      setCode: "PRB02",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-056_p1.jpg",
    },
    {
      id: "OP07-056_r1",
      artId: "OP07-056_r1",
      setCode: "PRB02",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-056_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-056_r1.jpg",
      imageId: "OP07-056_r1",
    },
  ],
  i18n: prb02SlaveArrowPirateFoil056I18n,
};
