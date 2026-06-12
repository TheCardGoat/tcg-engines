import type { CharacterCard } from "@tcg/lorcana-types";
import { teKLavaMonsterI18n } from "./058-te-k-lava-monster.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const teKLavaMonster: CharacterCard = {
  id: "e8J",
  canonicalId: "ci_e8J",
  reprints: ["set7-058"],
  cardType: "character",
  name: "Te Kā",
  version: "Lava Monster",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "007",
  cardNumber: 58,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ef4c7e8b987648b1ad759f754aaafc9e",
    tcgPlayer: 619436,
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [challenger(2)],
  i18n: teKLavaMonsterI18n,
};
