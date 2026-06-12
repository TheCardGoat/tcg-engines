import type { CharacterCard } from "@tcg/lorcana-types";
import { scarFieryUsurperI18n } from "./122-scar-fiery-usurper.i18n";

export const scarFieryUsurper: CharacterCard = {
  id: "AoK",
  canonicalId: "ci_AoK",
  reprints: ["set1-122"],
  cardType: "character",
  name: "Scar",
  version: "Fiery Usurper",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 122,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_59bf4857765e425bb663ea128e53ee0b",
    tcgPlayer: 492711,
  },
  classifications: ["Dreamborn", "Villain"],
  i18n: scarFieryUsurperI18n,
};
