import type { CharacterCard } from "@tcg/op-types";
import { prb02MountainGodPirateFoil018I18n } from "./018-mountain-god-pirate-foil.i18n.ts";

export const prb02MountainGodPirateFoil018: CharacterCard = {
  id: "EB01-018",
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
