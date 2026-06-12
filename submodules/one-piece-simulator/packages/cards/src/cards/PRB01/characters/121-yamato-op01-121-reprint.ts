import type { CharacterCard } from "@tcg/op-types";
import { prb01YamatoOp01121Reprint121I18n } from "./121-yamato-op01-121-reprint.i18n.ts";

export const prb01YamatoOp01121Reprint121: CharacterCard = {
  id: "OP01-121",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-121_p4.jpg",
      imageId: "OP01-121_p4",
    },
  ],
  effect:
    "Also treat this card's name as [Kouzuki Oden] according to the rules.[Double Attack] (This card deals 2 damage.)[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)Disclaimer: This card was reprinted from the original set with an additional security stamp on the bottom-left corner (note that this difference is not visible in official sample images).",
  effects: {
    keywords: ["doubleAttack", "banish"],
  },
  i18n: prb01YamatoOp01121Reprint121I18n,
};
