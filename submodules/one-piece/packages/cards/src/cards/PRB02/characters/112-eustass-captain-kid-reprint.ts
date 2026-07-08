import type { CharacterCard } from "@tcg/op-types";
import { op10EustassCaptainKid112 } from "../../OP10/characters/112-eustass-captain-kid.ts";
import { prb02EustassCaptainKidReprint112I18n } from "./112-eustass-captain-kid-reprint.i18n.ts";

export const prb02EustassCaptainKidReprint112: CharacterCard = {
  ...op10EustassCaptainKid112,
  id: "OP10-112_r1",
  slug: "eustass-captain-kid-reprint/op10-112",
  name: 'Eustass"Captain"Kid (Reprint)',
  printings: [
    {
      id: "OP10-112_r1",
      artId: "OP10-112_r1",
      setCode: "PRB02",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-112_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02EustassCaptainKidReprint112I18n,
};
