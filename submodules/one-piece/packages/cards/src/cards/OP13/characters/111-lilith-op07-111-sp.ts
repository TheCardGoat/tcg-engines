import type { CharacterCard } from "@tcg/op-types";
import { op07Lilith111 } from "../../OP07/characters/111-lilith.ts";
import { op13LilithOp07111Sp111I18n } from "./111-lilith-op07-111-sp.i18n.ts";

export const op13LilithOp07111Sp111: CharacterCard = {
  ...op07Lilith111,
  id: "OP07-111_p2_IJQHDKC",
  slug: "lilith-op07-111-sp",
  name: "Lilith - OP07-111 (SP)",
  printings: [
    {
      id: "OP07-111_p2_IJQHDKC",
      artId: "OP07-111_p2_IJQHDKC",
      setCode: "OP13",
      collectorNumber: "111",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-111_p2_IJQHDKC.png",
    },
  ],
  rarity: "SR",
  setId: "OP13",
  artVariants: undefined,
  i18n: op13LilithOp07111Sp111I18n,
};
