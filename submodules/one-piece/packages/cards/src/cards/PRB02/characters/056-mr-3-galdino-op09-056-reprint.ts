import type { CharacterCard } from "@tcg/op-types";
import { op09Mr3Galdino056 } from "../../OP09/characters/056-mr-3-galdino.ts";
import { prb02Mr3GaldinoOp09056Reprint056I18n } from "./056-mr-3-galdino-op09-056-reprint.i18n.ts";

export const prb02Mr3GaldinoOp09056Reprint056: CharacterCard = {
  ...op09Mr3Galdino056,
  id: "OP09-056_r2",
  slug: "mr-3-galdino-op09-056-reprint",
  name: "Mr.3(Galdino) - OP09-056 (Reprint)",
  printings: [
    {
      id: "OP09-056_r2",
      artId: "OP09-056_r2",
      setCode: "PRB02",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-056_r2.jpg",
    },
    {
      id: "OP09-056_p1",
      artId: "OP09-056_p1",
      setCode: "PRB02",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-056_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-056_p1.jpg",
      imageId: "OP09-056_p1",
    },
  ],
  i18n: prb02Mr3GaldinoOp09056Reprint056I18n,
};
