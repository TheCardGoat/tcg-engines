import type { CharacterCard } from "@tcg/op-types";
import { op06Tashigi050 } from "../../OP06/characters/050-tashigi.ts";
import { op12TashigiSp050I18n } from "./050-tashigi-sp.i18n.ts";

export const op12TashigiSp050: CharacterCard = {
  ...op06Tashigi050,
  id: "OP06-050_p2_QrK318i",
  slug: "tashigi-sp/op06-050",
  name: "Tashigi (SP)",
  printings: [
    {
      id: "OP06-050_p2_QrK318i",
      artId: "OP06-050_p2_QrK318i",
      setCode: "OP12",
      collectorNumber: "050",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-050_p2_QrK318i.jpg",
    },
  ],
  rarity: "R",
  setId: "OP12",
  artVariants: undefined,
  i18n: op12TashigiSp050I18n,
};
