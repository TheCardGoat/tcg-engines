import type { CharacterCard } from "@tcg/op-types";
import { op01BoaHancock078 } from "../../OP01/characters/078-boa-hancock.ts";
import { prb01BoaHancockOp01078Reprint078I18n } from "./078-boa-hancock-op01-078-reprint.i18n.ts";

export const prb01BoaHancockOp01078Reprint078: CharacterCard = {
  ...op01BoaHancock078,
  id: "OP01-078_r3",
  slug: "boa-hancock-op01-078-reprint",
  name: "Boa Hancock (OP01-078) (Reprint)",
  printings: [
    {
      id: "OP01-078_r3",
      artId: "OP01-078_r3",
      setCode: "PRB01",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-078_r3.jpg",
    },
    {
      id: "OP01-078_p4",
      artId: "OP01-078_p4",
      setCode: "PRB01",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-078_p4.png",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-078_p4.png",
      imageId: "OP01-078_p4",
    },
  ],
  i18n: prb01BoaHancockOp01078Reprint078I18n,
};
