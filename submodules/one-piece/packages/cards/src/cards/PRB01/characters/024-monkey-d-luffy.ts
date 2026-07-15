import type { CharacterCard } from "@tcg/op-types";
import { op01MonkeyDLuffy024 } from "../../OP01/characters/024-monkey-d-luffy.ts";
import { prb01MonkeyDLuffy024I18n } from "./024-monkey-d-luffy.i18n.ts";

export const prb01MonkeyDLuffy024: CharacterCard = {
  ...op01MonkeyDLuffy024,
  id: "OP01-024_r1",
  slug: "monkey-d-luffy/op01-024-r1",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP01-024_r1",
      artId: "OP01-024_r1",
      setCode: "PRB01",
      collectorNumber: "024",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-024_r1.png",
    },
    {
      id: "OP01-024_p3",
      artId: "OP01-024_p3",
      setCode: "PRB01",
      collectorNumber: "024",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-024_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-024_p3.jpg",
      imageId: "OP01-024_p3",
    },
  ],
  i18n: prb01MonkeyDLuffy024I18n,
};
