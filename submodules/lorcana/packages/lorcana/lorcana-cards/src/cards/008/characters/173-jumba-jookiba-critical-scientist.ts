import type { CharacterCard } from "@tcg/lorcana-types";
import { jumbaJookibaCriticalScientistI18n } from "./173-jumba-jookiba-critical-scientist.i18n";

export const jumbaJookibaCriticalScientist: CharacterCard = {
  id: "Jir",
  canonicalId: "ci_Jir",
  reprints: ["set8-173"],
  cardType: "character",
  name: "Jumba Jookiba",
  version: "Critical Scientist",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "008",
  cardNumber: 173,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_303840f357ac4b089d20984dee17a8fa",
    tcgPlayer: 631468,
  },
  classifications: ["Storyborn", "Alien", "Inventor"],
  i18n: jumbaJookibaCriticalScientistI18n,
};
