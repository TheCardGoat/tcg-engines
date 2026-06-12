import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiMysteriousSageI18n } from "./054-rafiki-mysterious-sage.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const rafikiMysteriousSage: CharacterCard = {
  id: "HXN",
  canonicalId: "ci_HXN",
  reprints: ["set1-054"],
  cardType: "character",
  name: "Rafiki",
  version: "Mysterious Sage",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 54,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_3939d10a183b4eb48b843a68c74ed87b",
    tcgPlayer: 501405,
  },
  text: "Rush",
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  abilities: [rush],
  i18n: rafikiMysteriousSageI18n,
};
