import type { EventCard } from "@tcg/op-types";
import { eb01JustShutUpAndComeWithUs009 } from "../../EB01/events/009-just-shut-up-and-come-with-us.ts";
import { prb02JustShutUpAndComeWithUsPirateFoil009I18n } from "./009-just-shut-up-and-come-with-us-pirate-foil.i18n.ts";

export const prb02JustShutUpAndComeWithUsPirateFoil009: EventCard = {
  ...eb01JustShutUpAndComeWithUs009,
  id: "EB01-009_p1",
  slug: "just-shut-up-and-come-with-us-pirate-foil",
  name: "Just Shut Up and Come with Us!!!! (Pirate Foil)",
  printings: [
    {
      id: "EB01-009_p1",
      artId: "EB01-009_p1",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009_p1.jpg",
    },
    {
      id: "EB01-009_r1",
      artId: "EB01-009_r1",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009_r1.jpg",
      imageId: "EB01-009_r1",
    },
  ],
  i18n: prb02JustShutUpAndComeWithUsPirateFoil009I18n,
};
