import type { CharacterCard } from "@tcg/op-types";
import { op10Smoker030 } from "../../OP10/characters/030-smoker.ts";
import { op13SmokerOp10030Sp030I18n } from "./030-smoker-op10-030-sp.i18n.ts";

export const op13SmokerOp10030Sp030: CharacterCard = {
  ...op10Smoker030,
  id: "OP10-030_p2_60fEVos",
  slug: "smoker-op10-030-sp",
  name: "Smoker - OP10-030 (SP)",
  printings: [
    {
      id: "OP10-030_p2_60fEVos",
      artId: "OP10-030_p2_60fEVos",
      setCode: "OP13",
      collectorNumber: "030",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-030_p2_60fEVos.png",
    },
  ],
  rarity: "SR",
  setId: "OP13",
  artVariants: undefined,
  i18n: op13SmokerOp10030Sp030I18n,
};
