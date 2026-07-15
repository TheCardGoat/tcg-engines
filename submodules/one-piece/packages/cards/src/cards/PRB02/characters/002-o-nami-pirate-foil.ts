import type { CharacterCard } from "@tcg/op-types";
import { eb03ONamiSt18002002 } from "../../EB03/characters/002-o-nami-st18-002.ts";
import { prb02ONamiPirateFoil002I18n } from "./002-o-nami-pirate-foil.i18n.ts";

export const prb02ONamiPirateFoil002: CharacterCard = {
  ...eb03ONamiSt18002002,
  id: "ST18-002_p1",
  slug: "o-nami-pirate-foil",
  name: "O-Nami (Pirate Foil)",
  printings: [
    {
      id: "ST18-002_p1",
      artId: "ST18-002_p1",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-002_p1.jpg",
    },
    {
      id: "ST18-002_r1",
      artId: "ST18-002_r1",
      setCode: "PRB02",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-002_r1.jpg",
    },
  ],
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-002_r1.jpg",
      imageId: "ST18-002_r1",
    },
  ],
  i18n: prb02ONamiPirateFoil002I18n,
};
