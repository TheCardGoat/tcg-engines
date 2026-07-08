import type { CharacterCard } from "@tcg/op-types";
import { op05EmporioIvankov004 } from "../../OP05/characters/004-emporio-ivankov.ts";
import { prb02EmporioIvankovPirateFoil004I18n } from "./004-emporio-ivankov-pirate-foil.i18n.ts";

export const prb02EmporioIvankovPirateFoil004: CharacterCard = {
  ...op05EmporioIvankov004,
  id: "OP05-004_p1",
  slug: "emporio-ivankov-pirate-foil",
  name: "Emporio.Ivankov (Pirate Foil)",
  printings: [
    {
      id: "OP05-004_p1",
      artId: "OP05-004_p1",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-004_p1.jpg",
    },
    {
      id: "OP05-004_r1",
      artId: "OP05-004_r1",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-004_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-004_r1.jpg",
      imageId: "OP05-004_r1",
    },
  ],
  i18n: prb02EmporioIvankovPirateFoil004I18n,
};
