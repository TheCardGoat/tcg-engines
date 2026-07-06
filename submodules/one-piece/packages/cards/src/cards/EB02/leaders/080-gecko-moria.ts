import type { LeaderCard } from "@tcg/op-types";
import { op06GeckoMoria080 } from "../../OP06/leaders/080-gecko-moria.ts";
import { eb02GeckoMoria080I18n } from "./080-gecko-moria.i18n.ts";

export const eb02GeckoMoria080: LeaderCard = {
  ...op06GeckoMoria080,
  id: "OP06-080_nwlMmW7",
  slug: "gecko-moria/op06-080-nwlmmw7",
  name: "Gecko Moria",
  printings: [
    {
      id: "OP06-080_nwlMmW7",
      artId: "OP06-080_nwlMmW7",
      setCode: "EB02",
      collectorNumber: "080",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-080_nwlMmW7.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02GeckoMoria080I18n,
};
