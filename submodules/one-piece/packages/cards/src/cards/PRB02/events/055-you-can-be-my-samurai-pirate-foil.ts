import type { EventCard } from "@tcg/op-types";
import { op01YouCanBeMySamurai055 } from "../../OP01/events/055-you-can-be-my-samurai.ts";
import { prb02YouCanBeMySamuraiPirateFoil055I18n } from "./055-you-can-be-my-samurai-pirate-foil.i18n.ts";

export const prb02YouCanBeMySamuraiPirateFoil055: EventCard = {
  ...op01YouCanBeMySamurai055,
  id: "OP01-055_p1",
  slug: "you-can-be-my-samurai-pirate-foil",
  name: "You Can Be My Samurai!! (Pirate Foil)",
  printings: [
    {
      id: "OP01-055_p1",
      artId: "OP01-055_p1",
      setCode: "PRB02",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-055_p1.jpg",
    },
    {
      id: "OP01-055_r1",
      artId: "OP01-055_r1",
      setCode: "PRB02",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-055_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-055_r1.jpg",
      imageId: "OP01-055_r1",
    },
  ],
  i18n: prb02YouCanBeMySamuraiPirateFoil055I18n,
};
