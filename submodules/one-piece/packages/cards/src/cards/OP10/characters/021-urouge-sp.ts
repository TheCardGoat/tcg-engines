import type { CharacterCard } from "@tcg/op-types";
import { op07Urouge021 } from "../../OP07/characters/021-urouge.ts";
import { op10UrougeSp021I18n } from "./021-urouge-sp.i18n.ts";

export const op10UrougeSp021: CharacterCard = {
  ...op07Urouge021,
  id: "OP07-021_p2",
  slug: "urouge-sp",
  name: "Urouge (SP)",
  printings: [
    {
      id: "OP07-021_p2",
      artId: "OP07-021_p2",
      setCode: "OP10",
      collectorNumber: "021",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-021_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP10",
  artVariants: undefined,
  i18n: op10UrougeSp021I18n,
};
