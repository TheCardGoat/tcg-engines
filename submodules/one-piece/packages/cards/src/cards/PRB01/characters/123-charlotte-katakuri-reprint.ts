import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteKatakuri123 } from "../../OP03/characters/123-charlotte-katakuri.ts";
import { prb01CharlotteKatakuriReprint123I18n } from "./123-charlotte-katakuri-reprint.i18n.ts";

export const prb01CharlotteKatakuriReprint123: CharacterCard = {
  ...op03CharlotteKatakuri123,
  id: "OP03-123_r1",
  slug: "charlotte-katakuri-reprint",
  name: "Charlotte Katakuri (Reprint)",
  printings: [
    {
      id: "OP03-123_r1",
      artId: "OP03-123_r1",
      setCode: "PRB01",
      collectorNumber: "123",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-123_r1.png",
    },
    {
      id: "OP03-123_p4",
      artId: "OP03-123_p4",
      setCode: "PRB01",
      collectorNumber: "123",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-123_p4.jpg",
    },
  ],
  rarity: "SEC",
  setId: "PRB01",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-123_p4.jpg",
      imageId: "OP03-123_p4",
    },
  ],
  i18n: prb01CharlotteKatakuriReprint123I18n,
};
