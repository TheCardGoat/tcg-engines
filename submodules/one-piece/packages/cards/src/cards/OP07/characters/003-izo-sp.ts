import type { CharacterCard } from "@tcg/op-types";
import { op03Izo003 } from "../../OP03/characters/003-izo.ts";
import { op07IzoSp003I18n } from "./003-izo-sp.i18n.ts";

export const op07IzoSp003: CharacterCard = {
  ...op03Izo003,
  id: "OP03-003_p1",
  slug: "izo-sp",
  name: "Izo (SP)",
  printings: [
    {
      id: "OP03-003_p1",
      artId: "OP03-003_p1",
      setCode: "OP07",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "OP07",
  artVariants: undefined,
  i18n: op07IzoSp003I18n,
};
