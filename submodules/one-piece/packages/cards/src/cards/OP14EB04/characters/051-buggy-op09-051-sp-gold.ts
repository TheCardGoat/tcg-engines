import type { CharacterCard } from "@tcg/op-types";
import { op09Buggy051 } from "../../OP09/characters/051-buggy.ts";
import { op14eb04BuggyOp09051SpGold051I18n } from "./051-buggy-op09-051-sp-gold.i18n.ts";

export const op14eb04BuggyOp09051SpGold051: CharacterCard = {
  ...op09Buggy051,
  id: "OP09-051_p4",
  slug: "buggy-op09-051-sp-gold",
  name: "Buggy - OP09-051 (SP) (Gold)",
  printings: [
    {
      id: "OP09-051_p4",
      artId: "OP09-051_p4",
      setCode: "OP14EB04",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p4.png",
    },
    {
      id: "OP09-051_p5",
      artId: "OP09-051_p5",
      setCode: "OP14EB04",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p5.png",
    },
  ],
  rarity: "R",
  setId: "OP14EB04",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p5.png",
      imageId: "OP09-051_p5",
    },
  ],
  i18n: op14eb04BuggyOp09051SpGold051I18n,
};
