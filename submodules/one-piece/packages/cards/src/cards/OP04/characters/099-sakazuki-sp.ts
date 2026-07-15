import type { CharacterCard } from "@tcg/op-types";
import { op02Sakazuki099 } from "../../OP02/characters/099-sakazuki.ts";
import { op04SakazukiSp099I18n } from "./099-sakazuki-sp.i18n.ts";

export const op04SakazukiSp099: CharacterCard = {
  ...op02Sakazuki099,
  id: "OP02-099_p2",
  slug: "sakazuki-sp",
  name: "Sakazuki (SP)",
  printings: [
    {
      id: "OP02-099_p2",
      artId: "OP02-099_p2",
      setCode: "OP04",
      collectorNumber: "099",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04SakazukiSp099I18n,
};
