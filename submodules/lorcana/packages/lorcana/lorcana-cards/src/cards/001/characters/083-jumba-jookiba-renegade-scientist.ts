import type { CharacterCard } from "@tcg/lorcana-types";
import { jumbaJookibaRenegadeScientistI18n } from "./083-jumba-jookiba-renegade-scientist.i18n";

export const jumbaJookibaRenegadeScientist: CharacterCard = {
  id: "JMC",
  canonicalId: "ci_JMC",
  reprints: ["set1-083"],
  cardType: "character",
  name: "Jumba Jookiba",
  version: "Renegade Scientist",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 83,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a1887fe9f3f74f7183a0a9bc44f57582",
    tcgPlayer: 485366,
  },
  classifications: ["Dreamborn", "Alien", "Inventor"],
  i18n: jumbaJookibaRenegadeScientistI18n,
};
