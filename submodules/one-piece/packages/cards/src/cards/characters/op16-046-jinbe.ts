import type { CharacterCard } from "@tcg/op-types";
import { op16Jinbe046I18n } from "./op16-046-jinbe.i18n.ts";

export const op16Jinbe046: CharacterCard = {
  id: "OP16-046",
  canonicalId: "OP16-046",
  slug: "jinbe/op16-046",
  name: "Jinbe",
  printings: [
    {
      id: "OP16-046",
      artId: "OP16-046",
      setCode: "OP16",
      collectorNumber: "046",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-046_zZN3l0Y.jpg",
      label: "Jinbe (046)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP16",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Fish-Man The Sun Pirates Impel Down"],
  attribute: "strike",
  i18n: op16Jinbe046I18n,
};
