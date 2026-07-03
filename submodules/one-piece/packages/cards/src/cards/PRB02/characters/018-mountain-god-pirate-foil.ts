import type { CharacterCard } from "@tcg/op-types";
import { prb02MountainGodPirateFoil018I18n } from "./018-mountain-god-pirate-foil.i18n.ts";

export const prb02MountainGodPirateFoil018: CharacterCard = {
  id: "EB01-018",
  canonicalId: "EB01-018",
  slug: "mountain-god-pirate-foil",
  name: "Mountain God (Pirate Foil)",
  printings: [
    {
      id: "EB01-018",
      artId: "EB01-018",
      setCode: "PRB02",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018_r1_8aijthW.jpg",
    },
    {
      id: "EB01-018_r1",
      artId: "EB01-018_r1",
      setCode: "PRB02",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018_r1.jpg",
      imageId: "EB01-018_r1",
    },
  ],
  i18n: prb02MountainGodPirateFoil018I18n,
};
