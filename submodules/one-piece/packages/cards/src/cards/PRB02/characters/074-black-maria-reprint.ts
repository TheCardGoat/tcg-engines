import type { CharacterCard } from "@tcg/op-types";
import { op08BlackMaria074 } from "../../OP08/characters/074-black-maria.ts";
import { prb02BlackMariaReprint074I18n } from "./074-black-maria-reprint.i18n.ts";

export const prb02BlackMariaReprint074: CharacterCard = {
  ...op08BlackMaria074,
  id: "OP08-074_r1",
  slug: "black-maria-reprint",
  name: "Black Maria (Reprint)",
  printings: [
    {
      id: "OP08-074_r1",
      artId: "OP08-074_r1",
      setCode: "PRB02",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-074_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02BlackMariaReprint074I18n,
};
