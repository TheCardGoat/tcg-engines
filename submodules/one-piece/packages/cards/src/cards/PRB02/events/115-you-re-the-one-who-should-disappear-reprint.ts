import type { EventCard } from "@tcg/op-types";
import { op06YouReTheOneWhoShouldDisappear115 } from "../../OP06/events/115-you-re-the-one-who-should-disappear.ts";
import { prb02YouReTheOneWhoShouldDisappearReprint115I18n } from "./115-you-re-the-one-who-should-disappear-reprint.i18n.ts";

export const prb02YouReTheOneWhoShouldDisappearReprint115: EventCard = {
  ...op06YouReTheOneWhoShouldDisappear115,
  id: "OP06-115_r1",
  slug: "you-re-the-one-who-should-disappear-reprint",
  name: "You're the One Who Should Disappear (Reprint)",
  printings: [
    {
      id: "OP06-115_r1",
      artId: "OP06-115_r1",
      setCode: "PRB02",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-115_r1.jpg",
    },
    {
      id: "OP06-115_p1",
      artId: "OP06-115_p1",
      setCode: "PRB02",
      collectorNumber: "115",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-115_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-115_p1.jpg",
      imageId: "OP06-115_p1",
    },
  ],
  i18n: prb02YouReTheOneWhoShouldDisappearReprint115I18n,
};
