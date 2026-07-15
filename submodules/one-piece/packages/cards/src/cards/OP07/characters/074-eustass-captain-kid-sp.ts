import type { CharacterCard } from "@tcg/op-types";
import { op05EustassCaptainKid074 } from "../../OP05/characters/074-eustass-captain-kid.ts";
import { op07EustassCaptainKidSp074I18n } from "./074-eustass-captain-kid-sp.i18n.ts";

export const op07EustassCaptainKidSp074: CharacterCard = {
  ...op05EustassCaptainKid074,
  id: "OP05-074_p3",
  slug: "eustass-captain-kid-sp",
  name: 'Eustass"Captain"Kid (SP)',
  printings: [
    {
      id: "OP05-074_p3",
      artId: "OP05-074_p3",
      setCode: "OP07",
      collectorNumber: "074",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-074_p3.jpg",
    },
  ],
  rarity: "SR",
  setId: "OP07",
  artVariants: undefined,
  i18n: op07EustassCaptainKidSp074I18n,
};
