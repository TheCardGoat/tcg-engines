import type { CharacterCard } from "@tcg/op-types";
import { op09Uta002 } from "../../OP09/characters/002-uta.ts";
import { prb02UtaReprint002I18n } from "./002-uta-reprint.i18n.ts";

export const prb02UtaReprint002: CharacterCard = {
  ...op09Uta002,
  id: "OP09-002_r1",
  slug: "uta-reprint",
  name: "Uta (Reprint)",
  printings: [
    {
      id: "OP09-002_r1",
      artId: "OP09-002_r1",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-002_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02UtaReprint002I18n,
};
