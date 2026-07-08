import type { EventCard } from "@tcg/op-types";
import { op08ItSToDieFor076 } from "../../OP08/events/076-it-s-to-die-for.ts";
import { prb02ItSToDieForPirateFoil076I18n } from "./076-it-s-to-die-for-pirate-foil.i18n.ts";

export const prb02ItSToDieForPirateFoil076: EventCard = {
  ...op08ItSToDieFor076,
  id: "OP08-076_p1",
  slug: "it-s-to-die-for-pirate-foil",
  name: "It's to Die For (Pirate Foil)",
  printings: [
    {
      id: "OP08-076_p1",
      artId: "OP08-076_p1",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-076_p1.jpg",
    },
    {
      id: "OP08-076_r1",
      artId: "OP08-076_r1",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-076_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-076_r1.jpg",
      imageId: "OP08-076_r1",
    },
  ],
  i18n: prb02ItSToDieForPirateFoil076I18n,
};
