import type { CharacterCard } from "@tcg/op-types";
import { op01Raizo052 } from "../../OP01/characters/052-raizo.ts";
import { prb01RaizoFullArt052I18n } from "./052-raizo-full-art.i18n.ts";

export const prb01RaizoFullArt052: CharacterCard = {
  ...op01Raizo052,
  id: "OP01-052_p4",
  slug: "raizo-full-art",
  name: "Raizo (Full Art)",
  printings: [
    {
      id: "OP01-052_p4",
      artId: "OP01-052_p4",
      setCode: "PRB01",
      collectorNumber: "052",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_p4.jpg",
    },
    {
      id: "OP01-052_p3",
      artId: "OP01-052_p3",
      setCode: "PRB01",
      collectorNumber: "052",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_p3.jpg",
    },
    {
      id: "OP01-052_r1",
      artId: "OP01-052_r1",
      setCode: "PRB01",
      collectorNumber: "052",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_p3.jpg",
      imageId: "OP01-052_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_r1.jpg",
      imageId: "OP01-052_r1",
    },
  ],
  i18n: prb01RaizoFullArt052I18n,
};
