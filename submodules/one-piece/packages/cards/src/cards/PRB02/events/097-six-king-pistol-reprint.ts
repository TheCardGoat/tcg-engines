import type { EventCard } from "@tcg/op-types";
import { op03SixKingPistol097 } from "../../OP03/events/097-six-king-pistol.ts";
import { prb02SixKingPistolReprint097I18n } from "./097-six-king-pistol-reprint.i18n.ts";

export const prb02SixKingPistolReprint097: EventCard = {
  ...op03SixKingPistol097,
  id: "OP03-097_r1",
  slug: "six-king-pistol-reprint",
  name: "Six King Pistol (Reprint)",
  printings: [
    {
      id: "OP03-097_r1",
      artId: "OP03-097_r1",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-097_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SixKingPistolReprint097I18n,
};
