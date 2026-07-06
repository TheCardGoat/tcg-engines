import type { CharacterCard } from "@tcg/op-types";
import { op03Sogeking122 } from "../../OP03/characters/122-sogeking.ts";
import { prb01SogekingManga122I18n } from "./122-sogeking-manga.i18n.ts";

export const prb01SogekingManga122: CharacterCard = {
  ...op03Sogeking122,
  id: "OP03-122_r1",
  slug: "sogeking-manga",
  name: "Sogeking (Manga)",
  printings: [
    {
      id: "OP03-122_r1",
      artId: "OP03-122_r1",
      setCode: "PRB01",
      collectorNumber: "122",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-122_r1.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01SogekingManga122I18n,
};
