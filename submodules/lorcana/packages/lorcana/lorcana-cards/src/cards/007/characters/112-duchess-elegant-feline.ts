import type { CharacterCard } from "@tcg/lorcana-types";
import { duchessElegantFelineI18n } from "./112-duchess-elegant-feline.i18n";

export const duchessElegantFeline: CharacterCard = {
  id: "gHW",
  canonicalId: "ci_gHW",
  reprints: ["set7-112"],
  cardType: "character",
  name: "Duchess",
  version: "Elegant Feline",
  inkType: ["emerald"],
  franchise: "Aristocats",
  set: "007",
  cardNumber: 112,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_03494b6689ad4bbb9d4e5afac6db733d",
    tcgPlayer: 618153,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: duchessElegantFelineI18n,
};
