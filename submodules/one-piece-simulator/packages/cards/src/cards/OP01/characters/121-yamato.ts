import type { CharacterCard } from "@tcg/op-types";
import { op01Yamato121I18n } from "./121-yamato.i18n.ts";

export const op01Yamato121: CharacterCard = {
  id: "OP01-121",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP01",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p1.jpg",
      imageId: "OP01-121_p1",
    },
  ],
  effect:
    "Also treat this card's name as [Kouzuki Oden] according to the rules. [Double Attack] (This card deals 2 damage.) [Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    keywords: ["doubleAttack", "banish"],
  },
  i18n: op01Yamato121I18n,
};
