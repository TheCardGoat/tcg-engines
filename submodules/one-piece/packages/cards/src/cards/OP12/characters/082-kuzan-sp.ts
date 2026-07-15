import type { CharacterCard } from "@tcg/op-types";
import { op10Kuzan082 } from "../../OP10/characters/082-kuzan.ts";
import { op12KuzanSp082I18n } from "./082-kuzan-sp.i18n.ts";

export const op12KuzanSp082: CharacterCard = {
  ...op10Kuzan082,
  id: "OP10-082_p2_0rQ9fvR",
  slug: "kuzan-sp",
  name: "Kuzan (SP)",
  printings: [
    {
      id: "OP10-082_p2_0rQ9fvR",
      artId: "OP10-082_p2_0rQ9fvR",
      setCode: "OP12",
      collectorNumber: "082",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-082_p2_0rQ9fvR.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP12",
  artVariants: undefined,
  i18n: op12KuzanSp082I18n,
};
