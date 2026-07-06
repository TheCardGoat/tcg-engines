import type { CharacterCard } from "@tcg/op-types";
import { op01Okiku035 } from "../../OP01/characters/035-okiku.ts";
import { op07OkikuSp035I18n } from "./035-okiku-sp.i18n.ts";

export const op07OkikuSp035: CharacterCard = {
  ...op01Okiku035,
  id: "OP01-035_p2",
  slug: "okiku-sp",
  name: "Okiku (SP)",
  printings: [
    {
      id: "OP01-035_p2",
      artId: "OP01-035_p2",
      setCode: "OP07",
      collectorNumber: "035",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-035_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP07",
  artVariants: undefined,
  i18n: op07OkikuSp035I18n,
};
