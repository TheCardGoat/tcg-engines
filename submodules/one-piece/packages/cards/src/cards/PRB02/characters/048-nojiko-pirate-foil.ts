import type { CharacterCard } from "@tcg/op-types";
import { op03Nojiko048 } from "../../OP03/characters/048-nojiko.ts";
import { prb02NojikoPirateFoil048I18n } from "./048-nojiko-pirate-foil.i18n.ts";

export const prb02NojikoPirateFoil048: CharacterCard = {
  ...op03Nojiko048,
  id: "OP03-048_p1",
  slug: "nojiko-pirate-foil",
  name: "Nojiko (Pirate Foil)",
  printings: [
    {
      id: "OP03-048_p1",
      artId: "OP03-048_p1",
      setCode: "PRB02",
      collectorNumber: "048",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-048_p1.jpg",
    },
    {
      id: "OP03-048_r1",
      artId: "OP03-048_r1",
      setCode: "PRB02",
      collectorNumber: "048",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-048_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-048_r1.jpg",
      imageId: "OP03-048_r1",
    },
  ],
  i18n: prb02NojikoPirateFoil048I18n,
};
