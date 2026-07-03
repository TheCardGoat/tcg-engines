import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Cavendish004I18n } from "./004-cavendish.i18n.ts";

export const op14eb04Cavendish004: CharacterCard = {
  id: "OP14-004",
  canonicalId: "OP14-004",
  slug: "cavendish/op14-004",
  name: "Cavendish",
  printings: [
    {
      id: "OP14-004",
      artId: "OP14-004",
      setCode: "OP14EB04",
      collectorNumber: "004",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-004_22P8Eg4.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Beautiful Pirates Supernovas Dressrosa"],
  attribute: "slash",
  effect:
    "If this Character has 5000 power or more, this Character gains [Rush].\n(This card can attack on the turn in which it is played.)",
  i18n: op14eb04Cavendish004I18n,
};
