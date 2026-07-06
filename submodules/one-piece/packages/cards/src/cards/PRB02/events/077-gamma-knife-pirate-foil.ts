import type { EventCard } from "@tcg/op-types";
import { op05GammaKnife077 } from "../../OP05/events/077-gamma-knife.ts";
import { prb02GammaKnifePirateFoil077I18n } from "./077-gamma-knife-pirate-foil.i18n.ts";

export const prb02GammaKnifePirateFoil077: EventCard = {
  ...op05GammaKnife077,
  id: "OP05-077_p1",
  slug: "gamma-knife-pirate-foil",
  name: "Gamma Knife (Pirate Foil)",
  printings: [
    {
      id: "OP05-077_p1",
      artId: "OP05-077_p1",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-077_p1.jpg",
    },
    {
      id: "OP05-077_r1",
      artId: "OP05-077_r1",
      setCode: "PRB02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-077_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-077_r1.jpg",
      imageId: "OP05-077_r1",
    },
  ],
  i18n: prb02GammaKnifePirateFoil077I18n,
};
