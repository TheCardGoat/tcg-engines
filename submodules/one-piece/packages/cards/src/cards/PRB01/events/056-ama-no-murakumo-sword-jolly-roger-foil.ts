import type { EventCard } from "@tcg/op-types";
import { op06AmaNoMurakumoSword056 } from "../../OP06/events/056-ama-no-murakumo-sword.ts";
import { prb01AmaNoMurakumoSwordJollyRogerFoil056I18n } from "./056-ama-no-murakumo-sword-jolly-roger-foil.i18n.ts";

export const prb01AmaNoMurakumoSwordJollyRogerFoil056: EventCard = {
  ...op06AmaNoMurakumoSword056,
  id: "OP06-056_p2",
  slug: "ama-no-murakumo-sword-jolly-roger-foil",
  name: "Ama no Murakumo Sword (Jolly Roger Foil)",
  printings: [
    {
      id: "OP06-056_p2",
      artId: "OP06-056_p2",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_p2.jpg",
    },
    {
      id: "OP06-056_p3",
      artId: "OP06-056_p3",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_p3.jpg",
    },
    {
      id: "OP06-056_r1",
      artId: "OP06-056_r1",
      setCode: "PRB01",
      collectorNumber: "056",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_r1.png",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_p3.jpg",
      imageId: "OP06-056_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-056_r1.png",
      imageId: "OP06-056_r1",
    },
  ],
  i18n: prb01AmaNoMurakumoSwordJollyRogerFoil056I18n,
};
