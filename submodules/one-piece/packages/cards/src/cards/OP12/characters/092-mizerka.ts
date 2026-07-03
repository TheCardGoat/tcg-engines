import type { CharacterCard } from "@tcg/op-types";
import { op12Mizerka092I18n } from "./092-mizerka.i18n.ts";

export const op12Mizerka092: CharacterCard = {
  id: "OP12-092",
  canonicalId: "OP12-092",
  slug: "mizerka",
  name: "Mizerka",
  printings: [
    {
      id: "OP12-092",
      artId: "OP12-092",
      setCode: "OP12",
      collectorNumber: "092",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-092_NLZDsnD.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "strike",
  i18n: op12Mizerka092I18n,
};
