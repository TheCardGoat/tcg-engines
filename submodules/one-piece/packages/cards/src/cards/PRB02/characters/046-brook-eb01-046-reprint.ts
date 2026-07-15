import type { CharacterCard } from "@tcg/op-types";
import { eb01Brook046 } from "../../EB01/characters/046-brook.ts";
import { prb02BrookEb01046Reprint046I18n } from "./046-brook-eb01-046-reprint.i18n.ts";

export const prb02BrookEb01046Reprint046: CharacterCard = {
  ...eb01Brook046,
  id: "EB01-046_r1",
  slug: "brook-eb01-046-reprint",
  name: "Brook - EB01-046 (Reprint)",
  printings: [
    {
      id: "EB01-046_r1",
      artId: "EB01-046_r1",
      setCode: "PRB02",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-046_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02BrookEb01046Reprint046I18n,
};
