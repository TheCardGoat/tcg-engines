import type { CharacterCard } from "@tcg/op-types";
import { eb01Shirahoshi057 } from "../../EB01/characters/057-shirahoshi.ts";
import { op11ShirahoshiSp057I18n } from "./057-shirahoshi-sp.i18n.ts";

export const op11ShirahoshiSp057: CharacterCard = {
  ...eb01Shirahoshi057,
  id: "EB01-057_p2",
  slug: "shirahoshi-sp",
  name: "Shirahoshi (SP)",
  printings: [
    {
      id: "EB01-057_p2",
      artId: "EB01-057_p2",
      setCode: "OP11",
      collectorNumber: "057",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-057_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP11",
  artVariants: undefined,
  i18n: op11ShirahoshiSp057I18n,
};
