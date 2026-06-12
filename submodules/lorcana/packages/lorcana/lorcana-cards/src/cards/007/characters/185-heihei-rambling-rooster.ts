import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiRamblingRoosterI18n } from "./185-heihei-rambling-rooster.i18n";

export const heiheiRamblingRooster: CharacterCard = {
  id: "5e5",
  canonicalId: "ci_5e5",
  reprints: ["set7-185"],
  cardType: "character",
  name: "Heihei",
  version: "Rambling Rooster",
  inkType: ["steel"],
  franchise: "Moana",
  set: "007",
  cardNumber: 185,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_dc00dae899dc496da15fb2e6d8fb4eda",
    tcgPlayer: 619512,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: heiheiRamblingRoosterI18n,
};
