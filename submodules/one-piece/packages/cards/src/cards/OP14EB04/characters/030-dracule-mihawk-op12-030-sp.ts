import type { CharacterCard } from "@tcg/op-types";
import { op12DraculeMihawk030 } from "../../OP12/characters/030-dracule-mihawk.ts";
import { op14eb04DraculeMihawkOp12030Sp030I18n } from "./030-dracule-mihawk-op12-030-sp.i18n.ts";

export const op14eb04DraculeMihawkOp12030Sp030: CharacterCard = {
  ...op12DraculeMihawk030,
  id: "OP12-030_p2",
  slug: "dracule-mihawk-op12-030-sp",
  name: "Dracule Mihawk - OP12-030 (SP)",
  printings: [
    {
      id: "OP12-030_p2",
      artId: "OP12-030_p2",
      setCode: "OP14EB04",
      collectorNumber: "030",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-030_p2.png",
    },
  ],
  rarity: "SR",
  setId: "OP14EB04",
  artVariants: undefined,
  i18n: op14eb04DraculeMihawkOp12030Sp030I18n,
};
