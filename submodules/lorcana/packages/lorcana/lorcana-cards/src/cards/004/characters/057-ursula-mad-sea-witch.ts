import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaMadSeaWitchI18n } from "./057-ursula-mad-sea-witch.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const ursulaMadSeaWitch: CharacterCard = {
  id: "pPz",
  canonicalId: "ci_pPz",
  reprints: ["set4-057"],
  cardType: "character",
  name: "Ursula",
  version: "Mad Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 57,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3bee770abeec4669a01be3a0e307cf14",
    tcgPlayer: 550570,
  },
  text: "Challenger +2",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [challenger(2)],
  i18n: ursulaMadSeaWitchI18n,
};
