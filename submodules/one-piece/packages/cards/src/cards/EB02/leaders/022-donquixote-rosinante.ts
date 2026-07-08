import type { LeaderCard } from "@tcg/op-types";
import { op05DonquixoteRosinante022 } from "../../OP05/leaders/022-donquixote-rosinante.ts";
import { eb02DonquixoteRosinante022I18n } from "./022-donquixote-rosinante.i18n.ts";

export const eb02DonquixoteRosinante022: LeaderCard = {
  ...op05DonquixoteRosinante022,
  id: "OP05-022_Aqd5X1p",
  slug: "donquixote-rosinante/op05-022-aqd5x1p",
  name: "Donquixote Rosinante",
  printings: [
    {
      id: "OP05-022_Aqd5X1p",
      artId: "OP05-022_Aqd5X1p",
      setCode: "EB02",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-022_Aqd5X1p.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02DonquixoteRosinante022I18n,
};
