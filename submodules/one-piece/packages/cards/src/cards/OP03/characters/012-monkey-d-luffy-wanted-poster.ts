import type { CharacterCard } from "@tcg/op-types";
import { st01MonkeyDLuffy012 } from "../../ST01/index.ts";
import { op03MonkeyDLuffyWantedPoster012I18n } from "./012-monkey-d-luffy-wanted-poster.i18n.ts";

export const op03MonkeyDLuffyWantedPoster012: CharacterCard = {
  ...st01MonkeyDLuffy012,
  id: "ST01-012_p1",
  slug: "monkey-d-luffy-wanted-poster/st01-012",
  name: "Monkey.D.Luffy (Wanted Poster)",
  printings: [
    {
      id: "ST01-012_p1",
      artId: "ST01-012_p1",
      setCode: "OP03",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p1.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP03",
  artVariants: undefined,
  i18n: op03MonkeyDLuffyWantedPoster012I18n,
};
