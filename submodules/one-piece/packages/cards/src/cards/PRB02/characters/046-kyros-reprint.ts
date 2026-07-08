import type { CharacterCard } from "@tcg/op-types";
import { op10Kyros046 } from "../../OP10/characters/046-kyros.ts";
import { prb02KyrosReprint046I18n } from "./046-kyros-reprint.i18n.ts";

export const prb02KyrosReprint046: CharacterCard = {
  ...op10Kyros046,
  id: "OP10-046_r1",
  slug: "kyros-reprint",
  name: "Kyros (Reprint)",
  printings: [
    {
      id: "OP10-046_r1",
      artId: "OP10-046_r1",
      setCode: "PRB02",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-046_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02KyrosReprint046I18n,
};
