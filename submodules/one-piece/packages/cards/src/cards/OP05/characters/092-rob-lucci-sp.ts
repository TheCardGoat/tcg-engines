import type { CharacterCard } from "@tcg/op-types";
import { op03RobLucci092 } from "../../OP03/characters/092-rob-lucci.ts";
import { op05RobLucciSp092I18n } from "./092-rob-lucci-sp.i18n.ts";

export const op05RobLucciSp092: CharacterCard = {
  ...op03RobLucci092,
  id: "OP03-092_p2",
  slug: "rob-lucci-sp/op03-092",
  name: "Rob Lucci (SP)",
  printings: [
    {
      id: "OP03-092_p2",
      artId: "OP03-092_p2",
      setCode: "OP05",
      collectorNumber: "092",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-092_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP05",
  artVariants: undefined,
  i18n: op05RobLucciSp092I18n,
};
