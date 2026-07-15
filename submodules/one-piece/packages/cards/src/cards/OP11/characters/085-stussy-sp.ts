import type { CharacterCard } from "@tcg/op-types";
import { op07Stussy085 } from "../../OP07/characters/085-stussy.ts";
import { op11StussySp085I18n } from "./085-stussy-sp.i18n.ts";

export const op11StussySp085: CharacterCard = {
  ...op07Stussy085,
  id: "OP07-085_p2",
  slug: "stussy-sp",
  name: "Stussy (SP)",
  printings: [
    {
      id: "OP07-085_p2",
      artId: "OP07-085_p2",
      setCode: "OP11",
      collectorNumber: "085",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-085_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP11",
  artVariants: undefined,
  i18n: op11StussySp085I18n,
};
