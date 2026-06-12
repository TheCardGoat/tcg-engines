import type { CharacterCard } from "@tcg/lorcana-types";
import { yaoImperialSoldierI18n } from "./194-yao-imperial-soldier.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const yaoImperialSoldier: CharacterCard = {
  id: "0wR",
  canonicalId: "ci_0wR",
  reprints: ["set4-194"],
  cardType: "character",
  name: "Yao",
  version: "Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 194,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_80c0754783744500af77590d9234826c",
    tcgPlayer: 550622,
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Ally"],
  abilities: [challenger(2)],
  i18n: yaoImperialSoldierI18n,
};
