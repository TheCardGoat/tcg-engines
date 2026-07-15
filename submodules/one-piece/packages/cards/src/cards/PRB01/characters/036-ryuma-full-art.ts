import type { CharacterCard } from "@tcg/op-types";
import { op06Ryuma036 } from "../../OP06/characters/036-ryuma.ts";
import { prb01RyumaFullArt036I18n } from "./036-ryuma-full-art.i18n.ts";

export const prb01RyumaFullArt036: CharacterCard = {
  ...op06Ryuma036,
  id: "OP06-036_p3",
  slug: "ryuma-full-art",
  name: "Ryuma (Full Art)",
  printings: [
    {
      id: "OP06-036_p3",
      artId: "OP06-036_p3",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p3.jpg",
    },
    {
      id: "OP06-036_p2",
      artId: "OP06-036_p2",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p2.jpg",
    },
    {
      id: "OP06-036_r1",
      artId: "OP06-036_r1",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_r1.png",
    },
    {
      id: "OP06-036_p4",
      artId: "OP06-036_p4",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p4.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p2.jpg",
      imageId: "OP06-036_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_r1.png",
      imageId: "OP06-036_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-036_p4.jpg",
      imageId: "OP06-036_p4",
    },
  ],
  i18n: prb01RyumaFullArt036I18n,
};
