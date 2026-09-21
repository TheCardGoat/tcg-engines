import type { CharacterCard } from "@tcg/op-types";
import { eb01MountainGod018I18n } from "./eb01-018-mountain-god.i18n.ts";

export const eb01MountainGod018: CharacterCard = {
  id: "EB01-018",
  canonicalId: "EB01-018",
  slug: "mountain-god",
  name: "Mountain God",
  printings: [
    {
      id: "EB01-018",
      artId: "EB01-018",
      setCode: "EB01",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018.jpg",
    },
    {
      id: "EB01-018_r1",
      artId: "EB01-018_r1",
      setCode: "EB01",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018_r1.jpg",
    },
    {
      id: "EB01-018_r1_8aijthW",
      artId: "EB01-018_r1_8aijthW",
      setCode: "EB01",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-018.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB01",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Land of Wano"],
  attribute: "strike",
  i18n: eb01MountainGod018I18n,
};
