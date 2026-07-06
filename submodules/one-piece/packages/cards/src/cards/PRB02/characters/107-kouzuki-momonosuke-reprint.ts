import type { CharacterCard } from "@tcg/op-types";
import { op06KouzukiMomonosuke107 } from "../../OP06/characters/107-kouzuki-momonosuke.ts";
import { prb02KouzukiMomonosukeReprint107I18n } from "./107-kouzuki-momonosuke-reprint.i18n.ts";

export const prb02KouzukiMomonosukeReprint107: CharacterCard = {
  ...op06KouzukiMomonosuke107,
  id: "OP06-107_r1",
  slug: "kouzuki-momonosuke-reprint",
  name: "Kouzuki Momonosuke (Reprint)",
  printings: [
    {
      id: "OP06-107_r1",
      artId: "OP06-107_r1",
      setCode: "PRB02",
      collectorNumber: "107",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-107_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02KouzukiMomonosukeReprint107I18n,
};
