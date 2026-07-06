import type { EventCard } from "@tcg/op-types";
import { op09BlackHole098 } from "../../OP09/events/098-black-hole.ts";
import { prb02BlackHolePirateFoil098I18n } from "./098-black-hole-pirate-foil.i18n.ts";

export const prb02BlackHolePirateFoil098: EventCard = {
  ...op09BlackHole098,
  id: "OP09-098_p1",
  slug: "black-hole-pirate-foil",
  name: "Black Hole (Pirate Foil)",
  printings: [
    {
      id: "OP09-098_p1",
      artId: "OP09-098_p1",
      setCode: "PRB02",
      collectorNumber: "098",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-098_p1.jpg",
    },
    {
      id: "OP09-098_r1",
      artId: "OP09-098_r1",
      setCode: "PRB02",
      collectorNumber: "098",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-098_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-098_r1.jpg",
      imageId: "OP09-098_r1",
    },
  ],
  i18n: prb02BlackHolePirateFoil098I18n,
};
