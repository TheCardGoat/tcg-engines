import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHunnyWizardI18n } from "./059-winnie-the-pooh-hunny-wizard.i18n";

export const winnieThePoohHunnyWizard: CharacterCard = {
  id: "Ij0",
  canonicalId: "ci_ITi",
  reprints: ["set2-059", "set9-041"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hunny Wizard",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 59,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_69d9b22e10244e2fb65ffbdb5f99da83",
    tcgPlayer: 651107,
  },
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  i18n: winnieThePoohHunnyWizardI18n,
};
