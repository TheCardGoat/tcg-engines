import type { CharacterCard } from "@tcg/op-types";
import { op05Koala006 } from "../../OP05/characters/006-koala.ts";
import { eb03KoalaOp05006006I18n } from "./006-koala-op05-006.i18n.ts";

export const eb03KoalaOp05006006: CharacterCard = {
  ...op05Koala006,
  id: "OP05-006_whMIxAV",
  slug: "koala-op05-006",
  name: "Koala - OP05-006",
  printings: [
    {
      id: "OP05-006_whMIxAV",
      artId: "OP05-006_whMIxAV",
      setCode: "EB03",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_whMIxAV.jpg",
    },
  ],
  rarity: "SR",
  setId: "EB03",
  artVariants: undefined,
  i18n: eb03KoalaOp05006006I18n,
};
