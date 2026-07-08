import type { CharacterCard } from "@tcg/op-types";
import { op05EustassCaptainKid074 } from "../../OP05/characters/074-eustass-captain-kid.ts";
import { prb01EustassCaptainKidReprint074I18n } from "./074-eustass-captain-kid-reprint.i18n.ts";

export const prb01EustassCaptainKidReprint074: CharacterCard = {
  ...op05EustassCaptainKid074,
  id: "OP05-074_r1",
  slug: "eustass-captain-kid-reprint/op05-074",
  name: 'Eustass"Captain"Kid (Reprint)',
  printings: [
    {
      id: "OP05-074_r1",
      artId: "OP05-074_r1",
      setCode: "PRB01",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_r1.jpg",
    },
    {
      id: "OP05-074_r2",
      artId: "OP05-074_r2",
      setCode: "PRB01",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_r2.jpg",
    },
    {
      id: "OP05-074_p5",
      artId: "OP05-074_p5",
      setCode: "PRB01",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p5.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_r2.jpg",
      imageId: "OP05-074_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p5.jpg",
      imageId: "OP05-074_p5",
    },
  ],
  i18n: prb01EustassCaptainKidReprint074I18n,
};
