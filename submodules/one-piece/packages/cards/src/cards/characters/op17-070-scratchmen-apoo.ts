import type { CharacterCard } from "@tcg/op-types";
import { op17ScratchmenApoo070I18n } from "./op17-070-scratchmen-apoo.i18n.ts";

export const op17ScratchmenApoo070: CharacterCard = {
  id: "OP17-070",
  canonicalId: "OP17-070",
  slug: "scratchmen-apoo/op17-070",
  name: "Scratchmen Apoo",
  printings: [
    {
      id: "OP17-070",
      artId: "OP17-070",
      setCode: "OP17",
      collectorNumber: "070",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-070_jak5ROy.jpg",
    },
    {
      id: "OP17-070_p1",
      artId: "OP17-070",
      setCode: "OP17",
      collectorNumber: "070",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-070_4dV6yml.jpg",
      label: "Scratchmen Apoo (Pandaman Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP17",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["On-Air Pirates Animal Kingdom Pirates"],
  attribute: "special",
  i18n: op17ScratchmenApoo070I18n,
};
