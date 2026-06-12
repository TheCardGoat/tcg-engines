import type { CharacterCard } from "@tcg/lorcana-types";
import { heathcliffStoicButlerI18n } from "./078-heathcliff-stoic-butler.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const heathcliffStoicButler: CharacterCard = {
  id: "tMg",
  canonicalId: "ci_tMg",
  reprints: ["set6-078"],
  cardType: "character",
  name: "Heathcliff",
  version: "Stoic Butler",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 78,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aab30247315a46debf548693f0b814c0",
    tcgPlayer: 593010,
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: heathcliffStoicButlerI18n,
};
