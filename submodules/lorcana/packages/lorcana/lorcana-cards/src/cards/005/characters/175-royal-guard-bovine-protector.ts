import type { CharacterCard } from "@tcg/lorcana-types";
import { royalGuardBovineProtectorI18n } from "./175-royal-guard-bovine-protector.i18n";

export const royalGuardBovineProtector: CharacterCard = {
  id: "MJS",
  canonicalId: "ci_MJS",
  reprints: ["set5-175"],
  cardType: "character",
  name: "Royal Guard",
  version: "Bovine Protector",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 175,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_905b7c293d554cbebda90ca9782af3bf",
    tcgPlayer: 561476,
  },
  classifications: ["Storyborn"],
  i18n: royalGuardBovineProtectorI18n,
};
