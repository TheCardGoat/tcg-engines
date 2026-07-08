import type { CharacterCard } from "@tcg/op-types";
import { op09CatarinaDevon084 } from "../../OP09/characters/084-catarina-devon.ts";
import { prb02CatarinaDevonPirateFoil084I18n } from "./084-catarina-devon-pirate-foil.i18n.ts";

export const prb02CatarinaDevonPirateFoil084: CharacterCard = {
  ...op09CatarinaDevon084,
  id: "OP09-084_p1",
  slug: "catarina-devon-pirate-foil",
  name: "Catarina Devon (Pirate Foil)",
  printings: [
    {
      id: "OP09-084_p1",
      artId: "OP09-084_p1",
      setCode: "PRB02",
      collectorNumber: "084",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-084_p1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-084_r1.jpg",
      imageId: "OP09-084",
    },
  ],
  i18n: prb02CatarinaDevonPirateFoil084I18n,
};
