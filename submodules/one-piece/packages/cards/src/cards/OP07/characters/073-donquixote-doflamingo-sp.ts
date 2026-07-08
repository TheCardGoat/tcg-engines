import type { CharacterCard } from "@tcg/op-types";
import { op01DonquixoteDoflamingo073 } from "../../OP01/characters/073-donquixote-doflamingo.ts";
import { op07DonquixoteDoflamingoSp073I18n } from "./073-donquixote-doflamingo-sp.i18n.ts";

export const op07DonquixoteDoflamingoSp073: CharacterCard = {
  ...op01DonquixoteDoflamingo073,
  id: "OP01-073_p2",
  slug: "donquixote-doflamingo-sp",
  name: "Donquixote Doflamingo (SP)",
  printings: [
    {
      id: "OP01-073_p2",
      artId: "OP01-073_p2",
      setCode: "OP07",
      collectorNumber: "073",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-073_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP07",
  artVariants: undefined,
  i18n: op07DonquixoteDoflamingoSp073I18n,
};
