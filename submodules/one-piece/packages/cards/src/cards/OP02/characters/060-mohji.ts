import type { CharacterCard } from "@tcg/op-types";
import { op02Mohji060I18n } from "./060-mohji.i18n.ts";

export const op02Mohji060: CharacterCard = {
  id: "OP02-060",
  canonicalId: "OP02-060",
  slug: "mohji/op02-060",
  name: "Mohji",
  printings: [
    {
      id: "OP02-060",
      artId: "OP02-060",
      setCode: "OP02",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-060.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Buggy Pirates"],
  attribute: "wisdom",
  i18n: op02Mohji060I18n,
};
