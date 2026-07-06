import type { CharacterCard } from "@tcg/op-types";
import { op08JewelryBonneySp007 } from "../../OP08/characters/007-jewelry-bonney-sp.ts";
import { prb02JewelryBonneySt02007PirateFoil007I18n } from "./007-jewelry-bonney-st02-007-pirate-foil.i18n.ts";

export const prb02JewelryBonneySt02007PirateFoil007: CharacterCard = {
  ...op08JewelryBonneySp007,
  id: "ST02-007_p3",
  slug: "jewelry-bonney-st02-007-pirate-foil",
  name: "Jewelry Bonney - ST02-007 (Pirate Foil)",
  printings: [
    {
      id: "ST02-007_p3",
      artId: "ST02-007_p3",
      setCode: "PRB02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_p3.jpg",
    },
    {
      id: "ST02-007_r1",
      artId: "ST02-007_r1",
      setCode: "PRB02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_r1.jpg",
      imageId: "ST02-007_r1",
    },
  ],
  i18n: prb02JewelryBonneySt02007PirateFoil007I18n,
};
