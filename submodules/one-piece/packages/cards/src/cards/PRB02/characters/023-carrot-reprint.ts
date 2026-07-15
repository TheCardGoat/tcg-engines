import type { CharacterCard } from "@tcg/op-types";
import { op08Carrot023 } from "../../OP08/characters/023-carrot.ts";
import { prb02CarrotReprint023I18n } from "./023-carrot-reprint.i18n.ts";

export const prb02CarrotReprint023: CharacterCard = {
  ...op08Carrot023,
  id: "OP08-023_r1",
  slug: "carrot-reprint",
  name: "Carrot (Reprint)",
  printings: [
    {
      id: "OP08-023_r1",
      artId: "OP08-023_r1",
      setCode: "PRB02",
      collectorNumber: "023",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023_r1.jpg",
    },
    {
      id: "OP08-023_p1",
      artId: "OP08-023_p1",
      setCode: "PRB02",
      collectorNumber: "023",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023_p1_8FjIUrx.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023_p1_8FjIUrx.jpg",
      imageId: "OP08-023_p1",
    },
  ],
  i18n: prb02CarrotReprint023I18n,
};
