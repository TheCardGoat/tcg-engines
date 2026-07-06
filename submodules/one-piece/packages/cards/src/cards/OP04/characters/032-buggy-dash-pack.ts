import type { CharacterCard } from "@tcg/op-types";
import { op03Buggy032 } from "../../OP03/characters/032-buggy.ts";
import { op04BuggyDashPack032I18n } from "./032-buggy-dash-pack.i18n.ts";

export const op04BuggyDashPack032: CharacterCard = {
  ...op03Buggy032,
  id: "OP03-032_OP04",
  slug: "buggy-dash-pack",
  name: "Buggy (Dash Pack)",
  printings: [
    {
      id: "OP03-032_OP04",
      artId: "OP03-032",
      setCode: "OP04",
      collectorNumber: "032",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-032.jpg",
    },
  ],
  rarity: "C",
  setId: "OP04",
  artVariants: undefined,
  i18n: op04BuggyDashPack032I18n,
};
