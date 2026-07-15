import type { EventCard } from "@tcg/op-types";
import { eb01OhComeMyWay038 } from "../../EB01/events/038-oh-come-my-way.ts";
import { prb02OhComeMyWayPirateFoil038I18n } from "./038-oh-come-my-way-pirate-foil.i18n.ts";

export const prb02OhComeMyWayPirateFoil038: EventCard = {
  ...eb01OhComeMyWay038,
  id: "EB01-038_p1",
  slug: "oh-come-my-way-pirate-foil",
  name: "Oh Come My Way (Pirate Foil)",
  printings: [
    {
      id: "EB01-038_p1",
      artId: "EB01-038_p1",
      setCode: "PRB02",
      collectorNumber: "038",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-038_p1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-038_r1.jpg",
      imageId: "EB01-038",
    },
  ],
  i18n: prb02OhComeMyWayPirateFoil038I18n,
};
