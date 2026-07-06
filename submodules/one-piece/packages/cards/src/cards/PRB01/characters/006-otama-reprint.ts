import type { CharacterCard } from "@tcg/op-types";
import { op01Otama006 } from "../../OP01/characters/006-otama.ts";
import { prb01OtamaReprint006I18n } from "./006-otama-reprint.i18n.ts";

export const prb01OtamaReprint006: CharacterCard = {
  ...op01Otama006,
  id: "OP01-006_r1",
  slug: "otama-reprint",
  name: "Otama (Reprint)",
  printings: [
    {
      id: "OP01-006_r1",
      artId: "OP01-006_r1",
      setCode: "PRB01",
      collectorNumber: "006",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_r1.jpg",
    },
    {
      id: "OP01-006_p3",
      artId: "OP01-006_p3",
      setCode: "PRB01",
      collectorNumber: "006",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p3.jpg",
    },
    {
      id: "OP01-006_p4",
      artId: "OP01-006_p4",
      setCode: "PRB01",
      collectorNumber: "006",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p4.jpg",
    },
    {
      id: "OP01-006_p5",
      artId: "OP01-006_p5",
      setCode: "PRB01",
      collectorNumber: "006",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p5.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB01",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p3.jpg",
      imageId: "OP01-006_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p4.jpg",
      imageId: "OP01-006_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-006_p5.jpg",
      imageId: "OP01-006_p5",
    },
  ],
  i18n: prb01OtamaReprint006I18n,
};
