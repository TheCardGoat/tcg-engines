import type { CharacterCard } from "@tcg/op-types";
import { op03Buggy008 } from "../../OP03/characters/008-buggy.ts";
import { op06BuggySp008I18n } from "./008-buggy-sp.i18n.ts";

export const op06BuggySp008: CharacterCard = {
  ...op03Buggy008,
  id: "OP03-008_p1",
  slug: "buggy-sp",
  name: "Buggy (SP)",
  printings: [
    {
      id: "OP03-008_p1",
      artId: "OP03-008_p1",
      setCode: "OP06",
      collectorNumber: "008",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-008_p1.jpg",
    },
  ],
  rarity: "UC",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06BuggySp008I18n,
};
