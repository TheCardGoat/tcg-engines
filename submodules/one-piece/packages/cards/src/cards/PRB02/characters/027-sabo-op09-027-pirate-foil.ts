import type { CharacterCard } from "@tcg/op-types";
import { op09Sabo027 } from "../../OP09/characters/027-sabo.ts";
import { prb02SaboOp09027PirateFoil027I18n } from "./027-sabo-op09-027-pirate-foil.i18n.ts";

export const prb02SaboOp09027PirateFoil027: CharacterCard = {
  ...op09Sabo027,
  id: "OP09-027_p1",
  slug: "sabo-op09-027-pirate-foil",
  name: "Sabo - OP09-027 (Pirate Foil)",
  printings: [
    {
      id: "OP09-027_p1",
      artId: "OP09-027_p1",
      setCode: "PRB02",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027_p1.jpg",
    },
    {
      id: "OP09-027_r1",
      artId: "OP09-027_r1",
      setCode: "PRB02",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027_r1.jpg",
      imageId: "OP09-027_r1",
    },
  ],
  i18n: prb02SaboOp09027PirateFoil027I18n,
};
