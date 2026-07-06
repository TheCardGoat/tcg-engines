import type { CharacterCard } from "@tcg/op-types";
import { op01Nami016 } from "../../OP01/characters/016-nami.ts";
import { op05NamiSp016I18n } from "./016-nami-sp.i18n.ts";

export const op05NamiSp016: CharacterCard = {
  ...op01Nami016,
  id: "OP01-016_p2",
  slug: "nami-sp/op01-016",
  name: "Nami (SP)",
  printings: [
    {
      id: "OP01-016_p2",
      artId: "OP01-016_p2",
      setCode: "OP05",
      collectorNumber: "016",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-016_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP05",
  artVariants: undefined,
  i18n: op05NamiSp016I18n,
};
