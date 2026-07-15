import type { CharacterCard } from "@tcg/op-types";
import { op09Yasopp013 } from "../../OP09/characters/013-yasopp.ts";
import { op12YasoppSp013I18n } from "./013-yasopp-sp.i18n.ts";

export const op12YasoppSp013: CharacterCard = {
  ...op09Yasopp013,
  id: "OP09-013_p2_jLoDhNS",
  slug: "yasopp-sp",
  name: "Yasopp (SP)",
  printings: [
    {
      id: "OP09-013_p2_jLoDhNS",
      artId: "OP09-013_p2_jLoDhNS",
      setCode: "OP12",
      collectorNumber: "013",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-013_p2_jLoDhNS.jpg",
    },
  ],
  rarity: "R",
  setId: "OP12",
  artVariants: undefined,
  i18n: op12YasoppSp013I18n,
};
