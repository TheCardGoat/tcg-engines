import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteCracker108 } from "../../OP03/characters/108-charlotte-cracker.ts";
import { prb01CharlotteCrackerReprint108I18n } from "./108-charlotte-cracker-reprint.i18n.ts";

export const prb01CharlotteCrackerReprint108: CharacterCard = {
  ...op03CharlotteCracker108,
  id: "OP03-108_p7",
  slug: "charlotte-cracker-reprint",
  name: "Charlotte Cracker (Reprint)",
  printings: [
    {
      id: "OP03-108_p7",
      artId: "OP03-108_p7",
      setCode: "PRB01",
      collectorNumber: "108",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-108_p7.jpg",
    },
    {
      id: "OP03-108_p3",
      artId: "OP03-108_p3",
      setCode: "PRB01",
      collectorNumber: "108",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-108_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-108_p3.jpg",
      imageId: "OP03-108_p3",
    },
  ],
  i18n: prb01CharlotteCrackerReprint108I18n,
};
