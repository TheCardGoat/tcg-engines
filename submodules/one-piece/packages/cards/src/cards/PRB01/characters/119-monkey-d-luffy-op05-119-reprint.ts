import type { CharacterCard } from "@tcg/op-types";
import { op05MonkeyDLuffy119 } from "../../OP05/characters/119-monkey-d-luffy.ts";
import { prb01MonkeyDLuffyOp05119Reprint119I18n } from "./119-monkey-d-luffy-op05-119-reprint.i18n.ts";

export const prb01MonkeyDLuffyOp05119Reprint119: CharacterCard = {
  ...op05MonkeyDLuffy119,
  id: "OP05-119_r1",
  slug: "monkey-d-luffy-op05-119-reprint",
  name: "Monkey.D.Luffy (OP05-119) (Reprint)",
  printings: [
    {
      id: "OP05-119_r1",
      artId: "OP05-119_r1",
      setCode: "PRB01",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_r1.jpg",
    },
    {
      id: "OP05-119_r2",
      artId: "OP05-119_r2",
      setCode: "PRB01",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_r2.jpg",
    },
    {
      id: "OP05-119_p4",
      artId: "OP05-119_p4",
      setCode: "PRB01",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p4.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_r2.jpg",
      imageId: "OP05-119_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p4.jpg",
      imageId: "OP05-119_p4",
    },
  ],
  i18n: prb01MonkeyDLuffyOp05119Reprint119I18n,
};
