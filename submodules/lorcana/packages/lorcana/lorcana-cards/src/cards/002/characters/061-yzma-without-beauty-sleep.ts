import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaWithoutBeautySleepI18n } from "./061-yzma-without-beauty-sleep.i18n";

export const yzmaWithoutBeautySleep: CharacterCard = {
  id: "T45",
  canonicalId: "ci_T45",
  reprints: ["set2-061"],
  cardType: "character",
  name: "Yzma",
  version: "Without Beauty Sleep",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 61,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_73984c4885124477b3a6a48fbe5cb2ac",
    tcgPlayer: 527269,
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  i18n: yzmaWithoutBeautySleepI18n,
};
