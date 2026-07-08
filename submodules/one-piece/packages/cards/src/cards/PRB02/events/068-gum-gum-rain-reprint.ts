import type { EventCard } from "@tcg/op-types";
import { op02GumGumRain068 } from "../../OP02/events/068-gum-gum-rain.ts";
import { prb02GumGumRainReprint068I18n } from "./068-gum-gum-rain-reprint.i18n.ts";

export const prb02GumGumRainReprint068: EventCard = {
  ...op02GumGumRain068,
  id: "OP02-068_r1",
  slug: "gum-gum-rain-reprint",
  name: "Gum-Gum Rain (Reprint)",
  printings: [
    {
      id: "OP02-068_r1",
      artId: "OP02-068_r1",
      setCode: "PRB02",
      collectorNumber: "068",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-068_r1.jpg",
    },
    {
      id: "OP02-068_p1",
      artId: "OP02-068_p1",
      setCode: "PRB02",
      collectorNumber: "068",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-068_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-068_p1.jpg",
      imageId: "OP02-068_p1",
    },
  ],
  i18n: prb02GumGumRainReprint068I18n,
};
