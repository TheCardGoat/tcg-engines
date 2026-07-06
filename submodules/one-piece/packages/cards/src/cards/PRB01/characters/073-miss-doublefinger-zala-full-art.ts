import type { CharacterCard } from "@tcg/op-types";
import { op05MissDoublefingerZala073 } from "../../OP05/characters/073-miss-doublefinger-zala.ts";
import { prb01MissDoublefingerZalaFullArt073I18n } from "./073-miss-doublefinger-zala-full-art.i18n.ts";

export const prb01MissDoublefingerZalaFullArt073: CharacterCard = {
  ...op05MissDoublefingerZala073,
  id: "OP05-073_p2_BpYvfDX",
  slug: "miss-doublefinger-zala-full-art",
  name: "Miss Doublefinger(Zala) (Full Art)",
  printings: [
    {
      id: "OP05-073_p2_BpYvfDX",
      artId: "OP05-073_p2_BpYvfDX",
      setCode: "PRB01",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_p2_BpYvfDX.jpg",
    },
    {
      id: "OP05-073_p2",
      artId: "OP05-073_p2",
      setCode: "PRB01",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_p2.jpg",
    },
    {
      id: "OP05-073_r1",
      artId: "OP05-073_r1",
      setCode: "PRB01",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_p2.jpg",
      imageId: "OP05-073_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-073_r1.jpg",
      imageId: "OP05-073_r1",
    },
  ],
  i18n: prb01MissDoublefingerZalaFullArt073I18n,
};
