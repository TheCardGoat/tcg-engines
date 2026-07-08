import type { EventCard } from "@tcg/op-types";
import { op07SlowSlowBeamSword076 } from "../../OP07/events/076-slow-slow-beam-sword.ts";
import { prb02SlowSlowBeamSwordPirateFoil076I18n } from "./076-slow-slow-beam-sword-pirate-foil.i18n.ts";

export const prb02SlowSlowBeamSwordPirateFoil076: EventCard = {
  ...op07SlowSlowBeamSword076,
  id: "OP07-076_p1",
  slug: "slow-slow-beam-sword-pirate-foil",
  name: "Slow-Slow Beam Sword (Pirate Foil)",
  printings: [
    {
      id: "OP07-076_p1",
      artId: "OP07-076_p1",
      setCode: "PRB02",
      collectorNumber: "076",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-076_p1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-076_r1.jpg",
      imageId: "OP07-076",
    },
  ],
  i18n: prb02SlowSlowBeamSwordPirateFoil076I18n,
};
