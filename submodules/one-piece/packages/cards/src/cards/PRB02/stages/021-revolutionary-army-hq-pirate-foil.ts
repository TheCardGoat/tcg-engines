import type { StageCard } from "@tcg/op-types";
import { op05RevolutionaryArmyHq021 } from "../../OP05/stages/021-revolutionary-army-hq.ts";
import { prb02RevolutionaryArmyHqPirateFoil021I18n } from "./021-revolutionary-army-hq-pirate-foil.i18n.ts";

export const prb02RevolutionaryArmyHqPirateFoil021: StageCard = {
  ...op05RevolutionaryArmyHq021,
  id: "OP05-021_p1",
  slug: "revolutionary-army-hq-pirate-foil",
  name: "Revolutionary Army HQ (Pirate Foil)",
  printings: [
    {
      id: "OP05-021_p1",
      artId: "OP05-021_p1",
      setCode: "PRB02",
      collectorNumber: "021",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-021_p1.jpg",
    },
    {
      id: "OP05-021_r1",
      artId: "OP05-021_r1",
      setCode: "PRB02",
      collectorNumber: "021",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-021_r1.jpg",
    },
  ],
  rarity: "UC",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-021_r1.jpg",
      imageId: "OP05-021_r1",
    },
  ],
  i18n: prb02RevolutionaryArmyHqPirateFoil021I18n,
};
