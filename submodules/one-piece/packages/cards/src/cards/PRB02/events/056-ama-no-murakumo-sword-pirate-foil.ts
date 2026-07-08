import type { EventCard } from "@tcg/op-types";
import { op06AmaNoMurakumoSword056 } from "../../OP06/events/056-ama-no-murakumo-sword.ts";
import { prb02AmaNoMurakumoSwordPirateFoil056I18n } from "./056-ama-no-murakumo-sword-pirate-foil.i18n.ts";

export const prb02AmaNoMurakumoSwordPirateFoil056: EventCard = {
  ...op06AmaNoMurakumoSword056,
  id: "OP06-056_p4",
  slug: "ama-no-murakumo-sword-pirate-foil",
  name: "Ama no Murakumo Sword (Pirate Foil)",
  printings: [
    {
      id: "OP06-056_p4",
      artId: "OP06-056_p4",
      setCode: "PRB02",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_p4.jpg",
    },
    {
      id: "OP06-056_r2",
      artId: "OP06-056_r2",
      setCode: "PRB02",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_r2.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_r2.jpg",
      imageId: "OP06-056_r2",
    },
  ],
  i18n: prb02AmaNoMurakumoSwordPirateFoil056I18n,
};
