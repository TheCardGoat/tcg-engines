import type { CharacterCard } from "@tcg/op-types";
import { op06KouzukiHiyori106 } from "../../OP06/characters/106-kouzuki-hiyori.ts";
import { prb01KouzukiHiyori106I18n } from "./106-kouzuki-hiyori.i18n.ts";

export const prb01KouzukiHiyori106: CharacterCard = {
  ...op06KouzukiHiyori106,
  id: "OP06-106_r1",
  slug: "kouzuki-hiyori/op06-106-r1",
  name: "Kouzuki Hiyori",
  printings: [
    {
      id: "OP06-106_r1",
      artId: "OP06-106_r1",
      setCode: "PRB01",
      collectorNumber: "106",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-106_r1.png",
    },
    {
      id: "OP06-106_p3",
      artId: "OP06-106_p3",
      setCode: "PRB01",
      collectorNumber: "106",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-106_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-106_p3.jpg",
      imageId: "OP06-106_p3",
    },
  ],
  i18n: prb01KouzukiHiyori106I18n,
};
