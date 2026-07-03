import type { CharacterCard } from "@tcg/op-types";
import { op12Kawamatsu023I18n } from "./023-kawamatsu.i18n.ts";

export const op12Kawamatsu023: CharacterCard = {
  id: "OP12-023",
  canonicalId: "OP12-023",
  slug: "kawamatsu/op12-023",
  name: "Kawamatsu",
  printings: [
    {
      id: "OP12-023",
      artId: "OP12-023",
      setCode: "OP12",
      collectorNumber: "023",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-023_fMgLR2t.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Fish-Man Land of Wano The Akazaya Nine"],
  attribute: "slash",
  i18n: op12Kawamatsu023I18n,
};
