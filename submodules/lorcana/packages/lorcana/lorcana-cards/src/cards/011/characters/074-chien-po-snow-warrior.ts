import type { CharacterCard } from "@tcg/lorcana-types";
import { chienpoSnowWarriorI18n } from "./074-chien-po-snow-warrior.i18n";

export const chienpoSnowWarrior: CharacterCard = {
  id: "dxb",
  canonicalId: "ci_dxb",
  reprints: ["set11-074"],
  cardType: "character",
  name: "Chien-Po",
  version: "Snow Warrior",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 74,
  rarity: "uncommon",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9ea59b497df74d759d70cf087e044b16",
    tcgPlayer: 675388,
  },
  classifications: ["Storyborn", "Ally"],
  abilities: [],
  i18n: chienpoSnowWarriorI18n,
};
