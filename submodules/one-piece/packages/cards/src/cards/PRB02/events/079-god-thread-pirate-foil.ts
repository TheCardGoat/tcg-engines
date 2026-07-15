import type { EventCard } from "@tcg/op-types";
import { op10GodThread079 } from "../../OP10/events/079-god-thread.ts";
import { prb02GodThreadPirateFoil079I18n } from "./079-god-thread-pirate-foil.i18n.ts";

export const prb02GodThreadPirateFoil079: EventCard = {
  ...op10GodThread079,
  id: "OP10-079_p1",
  slug: "god-thread-pirate-foil",
  name: "God Thread (Pirate Foil)",
  printings: [
    {
      id: "OP10-079_p1",
      artId: "OP10-079_p1",
      setCode: "PRB02",
      collectorNumber: "079",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-079_p1.jpg",
    },
    {
      id: "OP10-079_r1",
      artId: "OP10-079_r1",
      setCode: "PRB02",
      collectorNumber: "079",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-079_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-079_r1.jpg",
      imageId: "OP10-079_r1",
    },
  ],
  i18n: prb02GodThreadPirateFoil079I18n,
};
