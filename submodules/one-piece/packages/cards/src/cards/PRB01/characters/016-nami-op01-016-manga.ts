import type { CharacterCard } from "@tcg/op-types";
import { op01Nami016 } from "../../OP01/characters/016-nami.ts";
import { prb01NamiOp01016Manga016I18n } from "./016-nami-op01-016-manga.i18n.ts";

export const prb01NamiOp01016Manga016: CharacterCard = {
  ...op01Nami016,
  id: "OP01-016_p8",
  slug: "nami-op01-016-manga",
  name: "Nami (OP01-016) (Manga)",
  printings: [
    {
      id: "OP01-016_p8",
      artId: "OP01-016_p8",
      setCode: "PRB01",
      collectorNumber: "016",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-016_p8.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01NamiOp01016Manga016I18n,
};
