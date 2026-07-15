import type { CharacterCard } from "@tcg/op-types";
import { op06GeckoMoria086 } from "../../OP06/characters/086-gecko-moria.ts";
import { prb01GeckoMoria086I18n } from "./086-gecko-moria.i18n.ts";

export const prb01GeckoMoria086: CharacterCard = {
  ...op06GeckoMoria086,
  id: "OP06-086_p3",
  slug: "gecko-moria/op06-086-p3",
  name: "Gecko Moria",
  printings: [
    {
      id: "OP06-086_p3",
      artId: "OP06-086_p3",
      setCode: "PRB01",
      collectorNumber: "086",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-086_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: undefined,
  i18n: prb01GeckoMoria086I18n,
};
