import type { CharacterCard } from "@tcg/op-types";
import { op07BasilHawkins029 } from "../../OP07/characters/029-basil-hawkins.ts";
import { prb02BasilHawkinsOp07029Reprint029I18n } from "./029-basil-hawkins-op07-029-reprint.i18n.ts";

export const prb02BasilHawkinsOp07029Reprint029: CharacterCard = {
  ...op07BasilHawkins029,
  id: "OP07-029_r1",
  slug: "basil-hawkins-op07-029-reprint",
  name: "Basil Hawkins - OP07-029 (Reprint)",
  printings: [
    {
      id: "OP07-029_r1",
      artId: "OP07-029_r1",
      setCode: "PRB02",
      collectorNumber: "029",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-029_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02BasilHawkinsOp07029Reprint029I18n,
};
