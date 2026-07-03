import type { CharacterCard } from "@tcg/op-types";
import { op11BlackMaria089I18n } from "./089-black-maria.i18n.ts";

export const op11BlackMaria089: CharacterCard = {
  id: "OP11-089",
  canonicalId: "OP11-089",
  slug: "black-maria/op11-089",
  name: "Black Maria",
  printings: [
    {
      id: "OP11-089",
      artId: "OP11-089",
      setCode: "OP11",
      collectorNumber: "089",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-089.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  i18n: op11BlackMaria089I18n,
};
