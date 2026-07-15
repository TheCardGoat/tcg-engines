import type { CharacterCard } from "@tcg/op-types";
import { op09JesusBurgess086 } from "../../OP09/characters/086-jesus-burgess.ts";
import { prb02JesusBurgessReprint086I18n } from "./086-jesus-burgess-reprint.i18n.ts";

export const prb02JesusBurgessReprint086: CharacterCard = {
  ...op09JesusBurgess086,
  id: "OP09-086_r2",
  slug: "jesus-burgess-reprint",
  name: "Jesus Burgess (Reprint)",
  printings: [
    {
      id: "OP09-086_r2",
      artId: "OP09-086_r2",
      setCode: "PRB02",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-086_r2.jpg",
    },
    {
      id: "OP09-086_p1",
      artId: "OP09-086_p1",
      setCode: "PRB02",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-086_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-086_p1.jpg",
      imageId: "OP09-086_p1",
    },
  ],
  i18n: prb02JesusBurgessReprint086I18n,
};
