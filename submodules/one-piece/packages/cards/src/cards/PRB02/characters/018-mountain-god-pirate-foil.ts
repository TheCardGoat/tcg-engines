import type { CharacterCard } from "@tcg/op-types";
import { eb01MountainGod018 } from "../../EB01/characters/018-mountain-god.ts";
import { prb02MountainGodPirateFoil018I18n } from "./018-mountain-god-pirate-foil.i18n.ts";

export const prb02MountainGodPirateFoil018: CharacterCard = {
  ...eb01MountainGod018,
  id: "EB01-018_r1_8aijthW",
  slug: "mountain-god-pirate-foil",
  name: "Mountain God (Pirate Foil)",
  printings: [
    {
      id: "EB01-018_r1_8aijthW",
      artId: "EB01-018_r1_8aijthW",
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
  rarity: "C",
  setId: "PRB02",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018_r1.jpg",
      imageId: "EB01-018_r1",
    },
  ],
  i18n: prb02MountainGodPirateFoil018I18n,
};
