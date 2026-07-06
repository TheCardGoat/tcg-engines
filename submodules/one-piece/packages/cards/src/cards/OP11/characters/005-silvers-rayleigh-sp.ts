import type { CharacterCard } from "@tcg/op-types";
import { op09SilversRayleigh005 } from "../../OP09/characters/005-silvers-rayleigh.ts";
import { op11SilversRayleighSp005I18n } from "./005-silvers-rayleigh-sp.i18n.ts";

export const op11SilversRayleighSp005: CharacterCard = {
  ...op09SilversRayleigh005,
  id: "OP09-005_p1",
  slug: "silvers-rayleigh-sp",
  name: "Silvers Rayleigh (SP)",
  printings: [
    {
      id: "OP09-005_p1",
      artId: "OP09-005_p1",
      setCode: "OP11",
      collectorNumber: "005",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-005_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "OP11",
  artVariants: undefined,
  i18n: op11SilversRayleighSp005I18n,
};
