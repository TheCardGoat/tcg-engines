import type { CharacterCard } from "@tcg/op-types";
import { op09DraculeMihawk048 } from "../../OP09/characters/048-dracule-mihawk.ts";
import { prb02DraculeMihawkOp09048Reprint048I18n } from "./048-dracule-mihawk-op09-048-reprint.i18n.ts";

export const prb02DraculeMihawkOp09048Reprint048: CharacterCard = {
  ...op09DraculeMihawk048,
  id: "OP09-048_r1",
  slug: "dracule-mihawk-op09-048-reprint",
  name: "Dracule Mihawk - OP09-048 (Reprint)",
  printings: [
    {
      id: "OP09-048_r1",
      artId: "OP09-048_r1",
      setCode: "PRB02",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-048_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02DraculeMihawkOp09048Reprint048I18n,
};
