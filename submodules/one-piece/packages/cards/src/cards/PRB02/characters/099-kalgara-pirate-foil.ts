import type { CharacterCard } from "@tcg/op-types";
import { op08Kalgara099 } from "../../OP08/characters/099-kalgara.ts";
import { prb02KalgaraPirateFoil099I18n } from "./099-kalgara-pirate-foil.i18n.ts";

export const prb02KalgaraPirateFoil099: CharacterCard = {
  ...op08Kalgara099,
  id: "OP08-099_p1",
  slug: "kalgara-pirate-foil",
  name: "Kalgara (Pirate Foil)",
  printings: [
    {
      id: "OP08-099_p1",
      artId: "OP08-099_p1",
      setCode: "PRB02",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099_p1.jpg",
    },
    {
      id: "OP08-099_r1",
      artId: "OP08-099_r1",
      setCode: "PRB02",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-099_r1.jpg",
      imageId: "OP08-099_r1",
    },
  ],
  i18n: prb02KalgaraPirateFoil099I18n,
};
