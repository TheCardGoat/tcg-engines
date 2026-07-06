import type { CharacterCard } from "@tcg/op-types";
import { op05Monet036 } from "../../OP05/characters/036-monet.ts";
import { prb02MonetPirateFoil036I18n } from "./036-monet-pirate-foil.i18n.ts";

export const prb02MonetPirateFoil036: CharacterCard = {
  ...op05Monet036,
  id: "OP05-036_p2",
  slug: "monet-pirate-foil",
  name: "Monet (Pirate Foil)",
  printings: [
    {
      id: "OP05-036_p2",
      artId: "OP05-036_p2",
      setCode: "PRB02",
      collectorNumber: "036",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-036_p2.jpg",
    },
    {
      id: "OP05-036_r1",
      artId: "OP05-036_r1",
      setCode: "PRB02",
      collectorNumber: "036",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-036_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-036_r1.jpg",
      imageId: "OP05-036_r1",
    },
  ],
  i18n: prb02MonetPirateFoil036I18n,
};
