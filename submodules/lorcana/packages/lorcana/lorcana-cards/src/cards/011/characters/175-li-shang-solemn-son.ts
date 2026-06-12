import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangSolemnSonI18n } from "./175-li-shang-solemn-son.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const liShangSolemnSon: CharacterCard = {
  id: "e25",
  canonicalId: "ci_e25",
  reprints: ["set11-175"],
  cardType: "character",
  name: "Li Shang",
  version: "Solemn Son",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 175,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b63df19a6a2e47edb0325ce080a7ac04",
    tcgPlayer: 676237,
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Hero", "Captain"],
  abilities: [challenger(2)],
  i18n: liShangSolemnSonI18n,
};
