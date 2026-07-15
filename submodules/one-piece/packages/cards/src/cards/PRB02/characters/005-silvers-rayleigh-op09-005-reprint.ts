import type { CharacterCard } from "@tcg/op-types";
import { op09SilversRayleigh005 } from "../../OP09/characters/005-silvers-rayleigh.ts";
import { prb02SilversRayleighOp09005Reprint005I18n } from "./005-silvers-rayleigh-op09-005-reprint.i18n.ts";

export const prb02SilversRayleighOp09005Reprint005: CharacterCard = {
  ...op09SilversRayleigh005,
  id: "OP09-005_r1",
  slug: "silvers-rayleigh-op09-005-reprint",
  name: "Silvers Rayleigh - OP09-005 (Reprint)",
  printings: [
    {
      id: "OP09-005_r1",
      artId: "OP09-005_r1",
      setCode: "PRB02",
      collectorNumber: "005",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-005_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SilversRayleighOp09005Reprint005I18n,
};
