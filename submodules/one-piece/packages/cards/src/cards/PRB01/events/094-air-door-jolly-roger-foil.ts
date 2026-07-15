import type { EventCard } from "@tcg/op-types";
import { op03AirDoor094 } from "../../OP03/events/094-air-door.ts";
import { prb01AirDoorJollyRogerFoil094I18n } from "./094-air-door-jolly-roger-foil.i18n.ts";

export const prb01AirDoorJollyRogerFoil094: EventCard = {
  ...op03AirDoor094,
  id: "OP03-094_p2",
  slug: "air-door-jolly-roger-foil",
  name: "Air Door (Jolly Roger Foil)",
  printings: [
    {
      id: "OP03-094_p2",
      artId: "OP03-094_p2",
      setCode: "PRB01",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-094_p2.jpg",
    },
    {
      id: "OP03-094_p3",
      artId: "OP03-094_p3",
      setCode: "PRB01",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-094_p3_ThOtDyx.jpg",
    },
    {
      id: "OP03-094_r1",
      artId: "OP03-094_r1",
      setCode: "PRB01",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-094_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-094_p3_ThOtDyx.jpg",
      imageId: "OP03-094_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-094_r1.png",
      imageId: "OP03-094_r1",
    },
  ],
  i18n: prb01AirDoorJollyRogerFoil094I18n,
};
