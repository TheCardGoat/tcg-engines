import type { CharacterCard } from "@tcg/op-types";
import { op02Sakazuki099 } from "../../OP02/characters/099-sakazuki.ts";
import { prb01SakazukiReprint099I18n } from "./099-sakazuki-reprint.i18n.ts";

export const prb01SakazukiReprint099: CharacterCard = {
  ...op02Sakazuki099,
  id: "OP02-099_r1",
  slug: "sakazuki-reprint",
  name: "Sakazuki (Reprint)",
  printings: [
    {
      id: "OP02-099_r1",
      artId: "OP02-099_r1",
      setCode: "PRB01",
      collectorNumber: "099",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099_r1.jpg",
    },
    {
      id: "OP02-099_p4",
      artId: "OP02-099_p4",
      setCode: "PRB01",
      collectorNumber: "099",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099_p4.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-099_p4.jpg",
      imageId: "OP02-099_p4",
    },
  ],
  i18n: prb01SakazukiReprint099I18n,
};
