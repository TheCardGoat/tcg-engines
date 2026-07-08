import type { CharacterCard } from "@tcg/op-types";
import { op03CharlottePerospero113 } from "../../OP03/characters/113-charlotte-perospero.ts";
import { prb01CharlottePerosperoReprint113I18n } from "./113-charlotte-perospero-reprint.i18n.ts";

export const prb01CharlottePerosperoReprint113: CharacterCard = {
  ...op03CharlottePerospero113,
  id: "OP03-113_r1",
  slug: "charlotte-perospero-reprint",
  name: "Charlotte Perospero (Reprint)",
  printings: [
    {
      id: "OP03-113_r1",
      artId: "OP03-113_r1",
      setCode: "PRB01",
      collectorNumber: "113",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-113_r1.jpg",
    },
    {
      id: "OP03-113_p3",
      artId: "OP03-113_p3",
      setCode: "PRB01",
      collectorNumber: "113",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-113_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-113_p3.jpg",
      imageId: "OP03-113_p3",
    },
  ],
  i18n: prb01CharlottePerosperoReprint113I18n,
};
