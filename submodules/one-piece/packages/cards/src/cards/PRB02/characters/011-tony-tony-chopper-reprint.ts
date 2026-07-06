import type { CharacterCard } from "@tcg/op-types";
import { op10TonyTonyChopper011 } from "../../OP10/characters/011-tony-tony-chopper.ts";
import { prb02TonyTonyChopperReprint011I18n } from "./011-tony-tony-chopper-reprint.i18n.ts";

export const prb02TonyTonyChopperReprint011: CharacterCard = {
  ...op10TonyTonyChopper011,
  id: "OP10-011_r1",
  slug: "tony-tony-chopper-reprint",
  name: "Tony Tony.Chopper (Reprint)",
  printings: [
    {
      id: "OP10-011_r1",
      artId: "OP10-011_r1",
      setCode: "PRB02",
      collectorNumber: "011",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-011_r1.jpg",
    },
    {
      id: "OP10-011_p1",
      artId: "OP10-011_p1",
      setCode: "PRB02",
      collectorNumber: "011",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-011_p1.jpg",
    },
  ],
  rarity: "R",
  setId: "PRB02",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-011_p1.jpg",
      imageId: "OP10-011_p1",
    },
  ],
  i18n: prb02TonyTonyChopperReprint011I18n,
};
