import type { CharacterCard } from "@tcg/lorcana-types";
import { taurusBulbaSteerminatorI18n } from "./106-taurus-bulba-steerminator.i18n";

export const taurusBulbaSteerminator: CharacterCard = {
  id: "QuQ",
  canonicalId: "ci_QuQ",
  reprints: ["set11-106"],
  cardType: "character",
  name: "Taurus Bulba",
  version: "Steerminator",
  inkType: ["ruby"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 106,
  rarity: "common",
  cost: 3,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_85d6bd70dfe74990af90d215e5010a8d",
    tcgPlayer: 676210,
  },
  classifications: ["Storyborn", "Super", "Villain"],
  i18n: taurusBulbaSteerminatorI18n,
};
