import type { CharacterCard } from "@tcg/op-types";
import { op03Kaya044 } from "../../OP03/characters/044-kaya.ts";
import { prb02KayaReprint044I18n } from "./044-kaya-reprint.i18n.ts";

export const prb02KayaReprint044: CharacterCard = {
  ...op03Kaya044,
  id: "OP03-044_r1",
  slug: "kaya-reprint",
  name: "Kaya (Reprint)",
  printings: [
    {
      id: "OP03-044_r1",
      artId: "OP03-044_r1",
      setCode: "PRB02",
      collectorNumber: "044",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-044_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02KayaReprint044I18n,
};
