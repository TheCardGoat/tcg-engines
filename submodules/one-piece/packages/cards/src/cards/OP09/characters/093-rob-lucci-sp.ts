import type { CharacterCard } from "@tcg/op-types";
import { op05RobLucci093 } from "../../OP05/characters/093-rob-lucci.ts";
import { op09RobLucciSp093I18n } from "./093-rob-lucci-sp.i18n.ts";

export const op09RobLucciSp093: CharacterCard = {
  ...op05RobLucci093,
  id: "OP05-093_p2",
  slug: "rob-lucci-sp/op05-093",
  name: "Rob Lucci (SP)",
  printings: [
    {
      id: "OP05-093_p2",
      artId: "OP05-093_p2",
      setCode: "OP09",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-093_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP09",
  artVariants: undefined,
  i18n: op09RobLucciSp093I18n,
};
