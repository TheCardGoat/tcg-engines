import type { CharacterCard } from "@tcg/op-types";
import { op09ZoroJuurouSt18004004 } from "../../OP09/characters/004-zoro-juurou-st18-004.ts";
import { op12ZoroJuurouSp004I18n } from "./004-zoro-juurou-sp.i18n.ts";

export const op12ZoroJuurouSp004: CharacterCard = {
  ...op09ZoroJuurouSt18004004,
  id: "ST18-004_p2_Tt367h1",
  slug: "zoro-juurou-sp/st18-004",
  name: "Zoro-Juurou (SP)",
  printings: [
    {
      id: "ST18-004_p2_Tt367h1",
      artId: "ST18-004_p2_Tt367h1",
      setCode: "OP12",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-004_p2_Tt367h1.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP12",
  artVariants: undefined,
  i18n: op12ZoroJuurouSp004I18n,
};
