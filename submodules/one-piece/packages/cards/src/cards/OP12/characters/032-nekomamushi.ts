import type { CharacterCard } from "@tcg/op-types";
import { op12Nekomamushi032I18n } from "./032-nekomamushi.i18n.ts";

export const op12Nekomamushi032: CharacterCard = {
  id: "OP12-032",
  canonicalId: "OP12-032",
  slug: "nekomamushi/op12-032",
  name: "Nekomamushi",
  printings: [
    {
      id: "OP12-032",
      artId: "OP12-032",
      setCode: "OP12",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-032_ZtIpWP2.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  i18n: op12Nekomamushi032I18n,
};
