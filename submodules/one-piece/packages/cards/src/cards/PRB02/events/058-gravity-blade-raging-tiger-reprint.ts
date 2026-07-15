import type { EventCard } from "@tcg/op-types";
import { op06GravityBladeRagingTiger058 } from "../../OP06/events/058-gravity-blade-raging-tiger.ts";
import { prb02GravityBladeRagingTigerReprint058I18n } from "./058-gravity-blade-raging-tiger-reprint.i18n.ts";

export const prb02GravityBladeRagingTigerReprint058: EventCard = {
  ...op06GravityBladeRagingTiger058,
  id: "OP06-058_r1",
  slug: "gravity-blade-raging-tiger-reprint",
  name: "Gravity Blade Raging Tiger (Reprint)",
  printings: [
    {
      id: "OP06-058_r1",
      artId: "OP06-058_r1",
      setCode: "PRB02",
      collectorNumber: "058",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-058_r1.jpg",
    },
    {
      id: "OP06-058_p1",
      artId: "OP06-058_p1",
      setCode: "PRB02",
      collectorNumber: "058",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-058_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-058_p1.jpg",
      imageId: "OP06-058_p1",
    },
  ],
  i18n: prb02GravityBladeRagingTigerReprint058I18n,
};
