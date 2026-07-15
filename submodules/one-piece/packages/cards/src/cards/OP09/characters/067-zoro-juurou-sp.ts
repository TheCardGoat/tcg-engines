import type { CharacterCard } from "@tcg/op-types";
import { op05ZoroJuurou067 } from "../../OP05/characters/067-zoro-juurou.ts";
import { op09ZoroJuurouSp067I18n } from "./067-zoro-juurou-sp.i18n.ts";

export const op09ZoroJuurouSp067: CharacterCard = {
  ...op05ZoroJuurou067,
  id: "OP05-067_p4",
  slug: "zoro-juurou-sp/op05-067",
  name: "Zoro-Juurou (SP)",
  printings: [
    {
      id: "OP05-067_p4",
      artId: "OP05-067_p4",
      setCode: "OP09",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-067_p4.jpg",
    },
    {
      id: "OP09-051_p2",
      artId: "OP09-051_p2",
      setCode: "OP09",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p2.jpg",
    },
  ],
  rarity: "R",
  setId: "OP09",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p2.jpg",
      imageId: "OP09-051_p2",
    },
  ],
  i18n: op09ZoroJuurouSp067I18n,
};
