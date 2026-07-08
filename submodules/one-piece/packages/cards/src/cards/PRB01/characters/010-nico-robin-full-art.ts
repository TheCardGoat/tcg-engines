import type { CharacterCard } from "@tcg/op-types";
import { op05NicoRobin010 } from "../../OP05/characters/010-nico-robin.ts";
import { prb01NicoRobinFullArt010I18n } from "./010-nico-robin-full-art.i18n.ts";

export const prb01NicoRobinFullArt010: CharacterCard = {
  ...op05NicoRobin010,
  id: "OP05-010_p3",
  slug: "nico-robin-full-art",
  name: "Nico Robin (Full Art)",
  printings: [
    {
      id: "OP05-010_p3",
      artId: "OP05-010_p3",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_p3.jpg",
    },
    {
      id: "OP05-010_p2",
      artId: "OP05-010_p2",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_p2.jpg",
    },
    {
      id: "OP05-010_r1",
      artId: "OP05-010_r1",
      setCode: "PRB01",
      collectorNumber: "010",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_p2.jpg",
      imageId: "OP05-010_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_r1.jpg",
      imageId: "OP05-010_r1",
    },
  ],
  i18n: prb01NicoRobinFullArt010I18n,
};
