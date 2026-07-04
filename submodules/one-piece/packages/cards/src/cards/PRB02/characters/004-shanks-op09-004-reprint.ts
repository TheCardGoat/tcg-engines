import type { CharacterCard } from "@tcg/op-types";
import { prb02ShanksOp09004Reprint004I18n } from "./004-shanks-op09-004-reprint.i18n.ts";

export const prb02ShanksOp09004Reprint004: CharacterCard = {
  id: "OP09-004",
  canonicalId: "OP09-004",
  slug: "shanks-op09-004-reprint",
  name: "Shanks - OP09-004 (Reprint)",
  printings: [
    {
      id: "OP09-004",
      artId: "OP09-004",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB02",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  effect:
    'Give all of your opponent\'s Characters 1000 power.[Rush] (This card can attack on the turn in which it is played.)Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["rush"],
  },
  i18n: prb02ShanksOp09004Reprint004I18n,
};
