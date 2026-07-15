import type { LeaderCard } from "@tcg/op-types";
import { op06Yamato022 } from "../../OP06/leaders/022-yamato.ts";
import { eb02Yamato022I18n } from "./022-yamato.i18n.ts";

export const eb02Yamato022: LeaderCard = {
  ...op06Yamato022,
  id: "OP06-022_HNfIWVa",
  slug: "yamato/op06-022-hnfiwva",
  name: "Yamato",
  printings: [
    {
      id: "OP06-022_HNfIWVa",
      artId: "OP06-022_HNfIWVa",
      setCode: "EB02",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-022_HNfIWVa.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Yamato022I18n,
};
