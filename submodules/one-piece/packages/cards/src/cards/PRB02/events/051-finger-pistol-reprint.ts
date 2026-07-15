import type { EventCard } from "@tcg/op-types";
import { eb01FingerPistol051 } from "../../EB01/events/051-finger-pistol.ts";
import { prb02FingerPistolReprint051I18n } from "./051-finger-pistol-reprint.i18n.ts";

export const prb02FingerPistolReprint051: EventCard = {
  ...eb01FingerPistol051,
  id: "EB01-051_r1",
  slug: "finger-pistol-reprint",
  name: "Finger Pistol (Reprint)",
  printings: [
    {
      id: "EB01-051_r1",
      artId: "EB01-051_r1",
      setCode: "PRB02",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-051_r1.jpg",
    },
    {
      id: "EB01-051_p1",
      artId: "EB01-051_p1",
      setCode: "PRB02",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-051_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-051_p1.jpg",
      imageId: "EB01-051_p1",
    },
  ],
  i18n: prb02FingerPistolReprint051I18n,
};
