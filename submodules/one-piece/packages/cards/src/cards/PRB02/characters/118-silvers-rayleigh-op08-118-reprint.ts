import type { CharacterCard } from "@tcg/op-types";
import { op08SilversRayleigh118 } from "../../OP08/characters/118-silvers-rayleigh.ts";
import { prb02SilversRayleighOp08118Reprint118I18n } from "./118-silvers-rayleigh-op08-118-reprint.i18n.ts";

export const prb02SilversRayleighOp08118Reprint118: CharacterCard = {
  ...op08SilversRayleigh118,
  id: "OP08-118_r1",
  slug: "silvers-rayleigh-op08-118-reprint",
  name: "Silvers Rayleigh - OP08-118 (Reprint)",
  printings: [
    {
      id: "OP08-118_r1",
      artId: "OP08-118_r1",
      setCode: "PRB02",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-118_r1.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02SilversRayleighOp08118Reprint118I18n,
};
