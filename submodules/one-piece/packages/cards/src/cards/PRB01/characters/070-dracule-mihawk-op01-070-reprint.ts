import type { CharacterCard } from "@tcg/op-types";
import { op01DraculeMihawk070 } from "../../OP01/characters/070-dracule-mihawk.ts";
import { prb01DraculeMihawkOp01070Reprint070I18n } from "./070-dracule-mihawk-op01-070-reprint.i18n.ts";

export const prb01DraculeMihawkOp01070Reprint070: CharacterCard = {
  ...op01DraculeMihawk070,
  id: "OP01-070_r1",
  slug: "dracule-mihawk-op01-070-reprint",
  name: "Dracule Mihawk (OP01-070) (Reprint)",
  printings: [
    {
      id: "OP01-070_r1",
      artId: "OP01-070_r1",
      setCode: "PRB01",
      collectorNumber: "070",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-070_r1.jpg",
    },
    {
      id: "OP01-070_p4",
      artId: "OP01-070_p4",
      setCode: "PRB01",
      collectorNumber: "070",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-070_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-070_p4.jpg",
      imageId: "OP01-070_p4",
    },
  ],
  i18n: prb01DraculeMihawkOp01070Reprint070I18n,
};
