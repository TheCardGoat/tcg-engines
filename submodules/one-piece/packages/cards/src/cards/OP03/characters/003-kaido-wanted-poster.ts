import type { CharacterCard } from "@tcg/op-types";
import { prb01Kaido003 } from "../../PRB01/characters/003-kaido.ts";
import { op03KaidoWantedPoster003I18n } from "./003-kaido-wanted-poster.i18n.ts";

export const op03KaidoWantedPoster003: CharacterCard = {
  ...prb01Kaido003,
  id: "ST04-003_p1",
  slug: "kaido-wanted-poster",
  name: "Kaido (Wanted Poster)",
  printings: [
    {
      id: "ST04-003_p1",
      artId: "ST04-003_p1",
      setCode: "OP03",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-003_p1.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP03",
  artVariants: undefined,
  i18n: op03KaidoWantedPoster003I18n,
};
