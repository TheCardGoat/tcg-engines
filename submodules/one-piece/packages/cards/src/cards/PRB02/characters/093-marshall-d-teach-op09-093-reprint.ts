import type { CharacterCard } from "@tcg/op-types";
import { op09MarshallDTeach093 } from "../../OP09/characters/093-marshall-d-teach.ts";
import { prb02MarshallDTeachOp09093Reprint093I18n } from "./093-marshall-d-teach-op09-093-reprint.i18n.ts";

export const prb02MarshallDTeachOp09093Reprint093: CharacterCard = {
  ...op09MarshallDTeach093,
  id: "OP09-093_r3",
  slug: "marshall-d-teach-op09-093-reprint",
  name: "Marshall.D.Teach - OP09-093 (Reprint)",
  printings: [
    {
      id: "OP09-093_r3",
      artId: "OP09-093_r3",
      setCode: "PRB02",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_r3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02MarshallDTeachOp09093Reprint093I18n,
};
