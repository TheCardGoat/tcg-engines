import type { CharacterCard } from "@tcg/op-types";
import { op06Perona093 } from "../../OP06/characters/093-perona.ts";
import { op14eb04PeronaOp06093Sp093I18n } from "./093-perona-op06-093-sp.i18n.ts";

export const op14eb04PeronaOp06093Sp093: CharacterCard = {
  ...op06Perona093,
  id: "OP06-093_p5",
  slug: "perona-op06-093-sp",
  name: "Perona - OP06-093 (SP)",
  printings: [
    {
      id: "OP06-093_p5",
      artId: "OP06-093_p5",
      setCode: "OP14EB04",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-093_p5.png",
    },
  ],
  rarity: "SR",
  setId: "OP14EB04",
  artVariants: undefined,
  i18n: op14eb04PeronaOp06093Sp093I18n,
};
