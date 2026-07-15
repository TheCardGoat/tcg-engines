import type { CharacterCard } from "@tcg/op-types";
import { st01MonkeyDLuffy012 } from "../../ST01/index.ts";
import { op05MonkeyDLuffy012I18n } from "./012-monkey-d-luffy.i18n.ts";

export const op05MonkeyDLuffy012: CharacterCard = {
  ...st01MonkeyDLuffy012,
  id: "ST01-012_p2",
  slug: "monkey-d-luffy/st01-012-p2",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST01-012_p2",
      artId: "ST01-012_p2",
      setCode: "OP05",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p2.jpg",
    },
    {
      id: "ST01-012_p3",
      artId: "ST01-012_p3",
      setCode: "OP05",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP05",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-012_p3.jpg",
      imageId: "ST01-012_p3",
    },
  ],
  i18n: op05MonkeyDLuffy012I18n,
};
