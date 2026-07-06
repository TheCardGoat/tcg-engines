import type { LeaderCard } from "@tcg/op-types";
import { op06Uta001 } from "../../OP06/leaders/001-uta.ts";
import { eb02Uta001I18n } from "./001-uta.i18n.ts";

export const eb02Uta001: LeaderCard = {
  ...op06Uta001,
  id: "OP06-001_LGQjHEA",
  slug: "uta/op06-001-lgqjhea",
  name: "Uta",
  printings: [
    {
      id: "OP06-001_LGQjHEA",
      artId: "OP06-001_LGQjHEA",
      setCode: "EB02",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-001_LGQjHEA.jpg",
    },
  ],
  rarity: "L",
  setId: "EB02",
  artVariants: undefined,
  i18n: eb02Uta001I18n,
};
