import type { CharacterCard } from "@tcg/op-types";
import { op09Crocodile046 } from "../../OP09/characters/046-crocodile.ts";
import { prb02CrocodileOp09046Reprint046I18n } from "./046-crocodile-op09-046-reprint.i18n.ts";

export const prb02CrocodileOp09046Reprint046: CharacterCard = {
  ...op09Crocodile046,
  id: "OP09-046_r1",
  slug: "crocodile-op09-046-reprint",
  name: "Crocodile - OP09-046 (Reprint)",
  printings: [
    {
      id: "OP09-046_r1",
      artId: "OP09-046_r1",
      setCode: "PRB02",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-046_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02CrocodileOp09046Reprint046I18n,
};
