import type { CharacterCard } from "@tcg/op-types";
import { op09Shanks004 } from "../../OP09/characters/004-shanks.ts";
import { prb02ShanksOp09004Reprint004I18n } from "./004-shanks-op09-004-reprint.i18n.ts";

export const prb02ShanksOp09004Reprint004: CharacterCard = {
  ...op09Shanks004,
  id: "OP09-004_r1",
  slug: "shanks-op09-004-reprint",
  name: "Shanks - OP09-004 (Reprint)",
  printings: [
    {
      id: "OP09-004_r1",
      artId: "OP09-004_r1",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02ShanksOp09004Reprint004I18n,
};
