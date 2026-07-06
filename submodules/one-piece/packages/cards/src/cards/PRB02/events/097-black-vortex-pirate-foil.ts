import type { EventCard } from "@tcg/op-types";
import { op09BlackVortex097 } from "../../OP09/events/097-black-vortex.ts";
import { prb02BlackVortexPirateFoil097I18n } from "./097-black-vortex-pirate-foil.i18n.ts";

export const prb02BlackVortexPirateFoil097: EventCard = {
  ...op09BlackVortex097,
  id: "OP09-097_p1",
  slug: "black-vortex-pirate-foil",
  name: "Black Vortex (Pirate Foil)",
  printings: [
    {
      id: "OP09-097_p1",
      artId: "OP09-097_p1",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-097_p1.jpg",
    },
    {
      id: "OP09-097_r1",
      artId: "OP09-097_r1",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-097_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-097_r1.jpg",
      imageId: "OP09-097_r1",
    },
  ],
  i18n: prb02BlackVortexPirateFoil097I18n,
};
