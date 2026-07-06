import type { CharacterCard } from "@tcg/op-types";
import { op06CharlottePudding047 } from "../../OP06/characters/047-charlotte-pudding.ts";
import { prb02CharlottePuddingReprint047I18n } from "./047-charlotte-pudding-reprint.i18n.ts";

export const prb02CharlottePuddingReprint047: CharacterCard = {
  ...op06CharlottePudding047,
  id: "OP06-047_r1",
  slug: "charlotte-pudding-reprint",
  name: "Charlotte Pudding (Reprint)",
  printings: [
    {
      id: "OP06-047_r1",
      artId: "OP06-047_r1",
      setCode: "PRB02",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-047_r1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-047_p1.jpg",
      imageId: "OP06-047",
    },
  ],
  i18n: prb02CharlottePuddingReprint047I18n,
};
