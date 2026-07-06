import type { CharacterCard } from "@tcg/op-types";
import { op05Maynard052 } from "../../OP05/characters/052-maynard.ts";
import { prb02MaynardPirateFoil052I18n } from "./052-maynard-pirate-foil.i18n.ts";

export const prb02MaynardPirateFoil052: CharacterCard = {
  ...op05Maynard052,
  id: "OP05-052_p1",
  slug: "maynard-pirate-foil",
  name: "Maynard (Pirate Foil)",
  printings: [
    {
      id: "OP05-052_p1",
      artId: "OP05-052_p1",
      setCode: "PRB02",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052_p1.jpg",
    },
    {
      id: "OP05-052_r1",
      artId: "OP05-052_r1",
      setCode: "PRB02",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-052_r1.jpg",
      imageId: "OP05-052_r1",
    },
  ],
  i18n: prb02MaynardPirateFoil052I18n,
};
