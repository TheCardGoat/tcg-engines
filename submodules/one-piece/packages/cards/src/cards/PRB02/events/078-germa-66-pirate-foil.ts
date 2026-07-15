import type { EventCard } from "@tcg/op-types";
import { op06Germa66078 } from "../../OP06/events/078-germa-66.ts";
import { prb02Germa66PirateFoil078I18n } from "./078-germa-66-pirate-foil.i18n.ts";

export const prb02Germa66PirateFoil078: EventCard = {
  ...op06Germa66078,
  id: "OP06-078_p1",
  slug: "germa-66-pirate-foil",
  name: "GERMA 66 (Pirate Foil)",
  printings: [
    {
      id: "OP06-078_p1",
      artId: "OP06-078_p1",
      setCode: "PRB02",
      collectorNumber: "078",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078_p1.jpg",
    },
    {
      id: "OP06-078_r1",
      artId: "OP06-078_r1",
      setCode: "PRB02",
      collectorNumber: "078",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078_r1.jpg",
      imageId: "OP06-078_r1",
    },
  ],
  i18n: prb02Germa66PirateFoil078I18n,
};
