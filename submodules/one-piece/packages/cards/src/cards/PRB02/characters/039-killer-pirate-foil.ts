import type { CharacterCard } from "@tcg/op-types";
import { op01Killer039 } from "../../OP01/characters/039-killer.ts";
import { prb02KillerPirateFoil039I18n } from "./039-killer-pirate-foil.i18n.ts";

export const prb02KillerPirateFoil039: CharacterCard = {
  ...op01Killer039,
  id: "OP01-039_p1",
  slug: "killer-pirate-foil",
  name: "Killer (Pirate Foil)",
  printings: [
    {
      id: "OP01-039_p1",
      artId: "OP01-039_p1",
      setCode: "PRB02",
      collectorNumber: "039",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-039_p1.jpg",
    },
    {
      id: "OP01-039_r1",
      artId: "OP01-039_r1",
      setCode: "PRB02",
      collectorNumber: "039",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-039_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-039_r1.jpg",
      imageId: "OP01-039_r1",
    },
  ],
  i18n: prb02KillerPirateFoil039I18n,
};
