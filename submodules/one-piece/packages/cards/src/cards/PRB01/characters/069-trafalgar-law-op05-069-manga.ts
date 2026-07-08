import type { CharacterCard } from "@tcg/op-types";
import { op05TrafalgarLaw069 } from "../../OP05/characters/069-trafalgar-law.ts";
import { prb01TrafalgarLawOp05069Manga069I18n } from "./069-trafalgar-law-op05-069-manga.i18n.ts";

export const prb01TrafalgarLawOp05069Manga069: CharacterCard = {
  ...op05TrafalgarLaw069,
  id: "OP05-069_r1",
  slug: "trafalgar-law-op05-069-manga",
  name: "Trafalgar Law (OP05-069) (Manga)",
  printings: [
    {
      id: "OP05-069_r1",
      artId: "OP05-069_r1",
      setCode: "PRB01",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-069_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01TrafalgarLawOp05069Manga069I18n,
};
