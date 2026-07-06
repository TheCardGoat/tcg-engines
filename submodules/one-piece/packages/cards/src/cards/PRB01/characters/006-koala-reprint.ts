import type { CharacterCard } from "@tcg/op-types";
import { op05Koala006 } from "../../OP05/characters/006-koala.ts";
import { prb01KoalaReprint006I18n } from "./006-koala-reprint.i18n.ts";

export const prb01KoalaReprint006: CharacterCard = {
  ...op05Koala006,
  id: "OP05-006_r1",
  slug: "koala-reprint",
  name: "Koala (Reprint)",
  printings: [
    {
      id: "OP05-006_r1",
      artId: "OP05-006_r1",
      setCode: "PRB01",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_r1.jpg",
    },
    {
      id: "OP05-006_p3",
      artId: "OP05-006_p3",
      setCode: "PRB01",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_p3.jpg",
      imageId: "OP05-006_p3",
    },
  ],
  i18n: prb01KoalaReprint006I18n,
};
