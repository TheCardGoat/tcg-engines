import type { EventCard } from "@tcg/op-types";
import { op07DragonBreath017 } from "../../OP07/events/017-dragon-breath.ts";
import { prb02DragonBreathPirateFoil017I18n } from "./017-dragon-breath-pirate-foil.i18n.ts";

export const prb02DragonBreathPirateFoil017: EventCard = {
  ...op07DragonBreath017,
  id: "OP07-017_p1",
  slug: "dragon-breath-pirate-foil",
  name: "Dragon Breath (Pirate Foil)",
  printings: [
    {
      id: "OP07-017_p1",
      artId: "OP07-017_p1",
      setCode: "PRB02",
      collectorNumber: "017",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-017_p1.jpg",
    },
    {
      id: "OP07-017_r1",
      artId: "OP07-017_r1",
      setCode: "PRB02",
      collectorNumber: "017",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-017_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-017_r1.jpg",
      imageId: "OP07-017_r1",
    },
  ],
  i18n: prb02DragonBreathPirateFoil017I18n,
};
