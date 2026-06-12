import type { CharacterCard } from "@tcg/lorcana-types";
import { generalLiHeadOfTheImperialArmyI18n } from "./187-general-li-head-of-the-imperial-army.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const generalLiHeadOfTheImperialArmy: CharacterCard = {
  id: "KF3",
  canonicalId: "ci_KF3",
  reprints: ["set8-187"],
  cardType: "character",
  name: "General Li",
  version: "Head of the Imperial Army",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 187,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0a9f2ad02684ebd877ed697c7ce1188",
    tcgPlayer: 631473,
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Mentor"],
  abilities: [resist(1)],
  i18n: generalLiHeadOfTheImperialArmyI18n,
};
