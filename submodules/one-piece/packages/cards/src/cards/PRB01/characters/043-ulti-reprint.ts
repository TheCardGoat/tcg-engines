import type { CharacterCard } from "@tcg/op-types";
import { op05Ulti043 } from "../../OP05/characters/043-ulti.ts";
import { prb01UltiReprint043I18n } from "./043-ulti-reprint.i18n.ts";

export const prb01UltiReprint043: CharacterCard = {
  ...op05Ulti043,
  id: "OP05-043_r1",
  slug: "ulti-reprint",
  name: "Ulti (Reprint)",
  printings: [
    {
      id: "OP05-043_r1",
      artId: "OP05-043_r1",
      setCode: "PRB01",
      collectorNumber: "043",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-043_r1.jpg",
    },
    {
      id: "OP05-043_p3",
      artId: "OP05-043_p3",
      setCode: "PRB01",
      collectorNumber: "043",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-043_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-043_p3.jpg",
      imageId: "OP05-043_p3",
    },
  ],
  i18n: prb01UltiReprint043I18n,
};
