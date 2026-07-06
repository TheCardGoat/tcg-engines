import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteLinlin114 } from "../../OP03/characters/114-charlotte-linlin.ts";
import { op06CharlotteLinlinSp114I18n } from "./114-charlotte-linlin-sp.i18n.ts";

export const op06CharlotteLinlinSp114: CharacterCard = {
  ...op03CharlotteLinlin114,
  id: "OP03-114_p2",
  slug: "charlotte-linlin-sp",
  name: "Charlotte Linlin (SP)",
  printings: [
    {
      id: "OP03-114_p2",
      artId: "OP03-114_p2",
      setCode: "OP06",
      collectorNumber: "114",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-114_p2.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP06",
  artVariants: undefined,
  i18n: op06CharlotteLinlinSp114I18n,
};
