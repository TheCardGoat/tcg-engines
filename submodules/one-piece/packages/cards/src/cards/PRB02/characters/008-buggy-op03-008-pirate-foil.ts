import type { CharacterCard } from "@tcg/op-types";
import { op03Buggy008 } from "../../OP03/characters/008-buggy.ts";
import { prb02BuggyOp03008PirateFoil008I18n } from "./008-buggy-op03-008-pirate-foil.i18n.ts";

export const prb02BuggyOp03008PirateFoil008: CharacterCard = {
  ...op03Buggy008,
  id: "OP03-008_p2",
  slug: "buggy-op03-008-pirate-foil",
  name: "Buggy - OP03-008 (Pirate Foil)",
  printings: [
    {
      id: "OP03-008_p2",
      artId: "OP03-008_p2",
      setCode: "PRB02",
      collectorNumber: "008",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-008_p2.jpg",
    },
    {
      id: "OP03-008_r1",
      artId: "OP03-008_r1",
      setCode: "PRB02",
      collectorNumber: "008",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-008_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-008_r1.jpg",
      imageId: "OP03-008_r1",
    },
  ],
  i18n: prb02BuggyOp03008PirateFoil008I18n,
};
