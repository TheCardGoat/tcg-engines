import type { CharacterCard } from "@tcg/op-types";
import { op05DonquixoteRosinante030 } from "../../OP05/characters/030-donquixote-rosinante.ts";
import { prb02DonquixoteRosinanteReprint030I18n } from "./030-donquixote-rosinante-reprint.i18n.ts";

export const prb02DonquixoteRosinanteReprint030: CharacterCard = {
  ...op05DonquixoteRosinante030,
  id: "OP05-030_r1",
  slug: "donquixote-rosinante-reprint",
  name: "Donquixote Rosinante (Reprint)",
  printings: [
    {
      id: "OP05-030_r1",
      artId: "OP05-030_r1",
      setCode: "PRB02",
      collectorNumber: "030",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-030_r1.jpg",
    },
    {
      id: "OP05-030_p1",
      artId: "OP05-030_p1",
      setCode: "PRB02",
      collectorNumber: "030",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-030_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-030_p1.jpg",
      imageId: "OP05-030_p1",
    },
  ],
  i18n: prb02DonquixoteRosinanteReprint030I18n,
};
