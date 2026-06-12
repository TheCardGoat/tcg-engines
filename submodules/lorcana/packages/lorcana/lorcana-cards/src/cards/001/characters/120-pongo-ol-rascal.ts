import type { CharacterCard } from "@tcg/lorcana-types";
import { pongoOlRascalI18n } from "./120-pongo-ol-rascal.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const pongoOlRascal: CharacterCard = {
  id: "Sa8",
  canonicalId: "ci_Sa8",
  reprints: ["set1-120"],
  cardType: "character",
  name: "Pongo",
  version: "Ol’ Rascal",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "001",
  cardNumber: 120,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e17a4efa1eaf47e2aefdcf3b98d4f03c",
    tcgPlayer: 503321,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero"],
  abilities: [evasive],
  i18n: pongoOlRascalI18n,
};
