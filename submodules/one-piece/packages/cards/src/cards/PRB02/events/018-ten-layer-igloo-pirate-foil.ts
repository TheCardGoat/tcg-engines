import type { EventCard } from "@tcg/op-types";
import { op10TenLayerIgloo018 } from "../../OP10/events/018-ten-layer-igloo.ts";
import { prb02TenLayerIglooPirateFoil018I18n } from "./018-ten-layer-igloo-pirate-foil.i18n.ts";

export const prb02TenLayerIglooPirateFoil018: EventCard = {
  ...op10TenLayerIgloo018,
  id: "OP10-018_OO8g5lU",
  slug: "ten-layer-igloo-pirate-foil",
  name: "Ten-Layer Igloo (Pirate Foil)",
  printings: [
    {
      id: "OP10-018_OO8g5lU",
      artId: "OP10-018_OO8g5lU",
      setCode: "PRB02",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-018_OO8g5lU.jpg",
    },
    {
      id: "OP10-018_r1",
      artId: "OP10-018_r1",
      setCode: "PRB02",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-018_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-018_r1.jpg",
      imageId: "OP10-018_r1",
    },
  ],
  i18n: prb02TenLayerIglooPirateFoil018I18n,
};
