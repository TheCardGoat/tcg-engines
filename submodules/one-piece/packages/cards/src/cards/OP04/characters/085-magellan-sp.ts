import type { CharacterCard } from "@tcg/op-types";
import { op02Magellan085 } from "../../OP02/characters/085-magellan.ts";
import { op04MagellanSp085I18n } from "./085-magellan-sp.i18n.ts";

export const op04MagellanSp085: CharacterCard = {
  ...op02Magellan085,
  id: "OP02-085_p2",
  slug: "magellan-sp",
  name: "Magellan (SP)",
  printings: [
    {
      id: "OP02-085_p2",
      artId: "OP02-085_p2",
      setCode: "OP04",
      collectorNumber: "085",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-085_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04MagellanSp085I18n,
};
