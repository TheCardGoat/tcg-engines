import type { StageCard } from "@tcg/op-types";
import { op05MaryGeoise097 } from "../../OP05/stages/097-mary-geoise.ts";
import { prb02MaryGeoisePirateFoil097I18n } from "./097-mary-geoise-pirate-foil.i18n.ts";

export const prb02MaryGeoisePirateFoil097: StageCard = {
  ...op05MaryGeoise097,
  id: "OP05-097_p1",
  slug: "mary-geoise-pirate-foil",
  name: "Mary Geoise (Pirate Foil)",
  printings: [
    {
      id: "OP05-097_p1",
      artId: "OP05-097_p1",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p1.jpg",
    },
    {
      id: "OP05-097_r1",
      artId: "OP05-097_r1",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_r1.jpg",
    },
    {
      id: "OP05-097_p2",
      artId: "OP05-097_p2",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p2.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_r1.jpg",
      imageId: "OP05-097_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p2.jpg",
      imageId: "OP05-097_p2",
    },
  ],
  i18n: prb02MaryGeoisePirateFoil097I18n,
};
