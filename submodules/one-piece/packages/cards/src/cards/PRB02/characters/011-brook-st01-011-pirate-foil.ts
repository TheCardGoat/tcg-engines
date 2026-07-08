import type { CharacterCard } from "@tcg/op-types";
import { st01Brook011 } from "../../ST01/index.ts";
import { prb02BrookSt01011PirateFoil011I18n } from "./011-brook-st01-011-pirate-foil.i18n.ts";

export const prb02BrookSt01011PirateFoil011: CharacterCard = {
  ...st01Brook011,
  id: "ST01-011_p4",
  slug: "brook-st01-011-pirate-foil",
  name: "Brook - ST01-011 (Pirate Foil)",
  printings: [
    {
      id: "ST01-011_p4",
      artId: "ST01-011_p4",
      setCode: "PRB02",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011_p4.jpg",
    },
    {
      id: "ST01-011_r1",
      artId: "ST01-011_r1",
      setCode: "PRB02",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-011_r1.jpg",
      imageId: "ST01-011_r1",
    },
  ],
  i18n: prb02BrookSt01011PirateFoil011I18n,
};
