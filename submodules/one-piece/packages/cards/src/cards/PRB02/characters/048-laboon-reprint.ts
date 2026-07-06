import type { CharacterCard } from "@tcg/op-types";
import { eb01Laboon048 } from "../../EB01/characters/048-laboon.ts";
import { prb02LaboonReprint048I18n } from "./048-laboon-reprint.i18n.ts";

export const prb02LaboonReprint048: CharacterCard = {
  ...eb01Laboon048,
  id: "EB01-048_r1",
  slug: "laboon-reprint",
  name: "Laboon (Reprint)",
  printings: [
    {
      id: "EB01-048_r1",
      artId: "EB01-048_r1",
      setCode: "PRB02",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-048_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02LaboonReprint048I18n,
};
