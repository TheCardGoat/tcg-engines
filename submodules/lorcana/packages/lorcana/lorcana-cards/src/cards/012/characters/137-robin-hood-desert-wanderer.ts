import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodDesertWandererI18n } from "./137-robin-hood-desert-wanderer.i18n";

export const robinHoodDesertWanderer: CharacterCard = {
  id: "6Vl",
  canonicalId: "ci_6Vl",
  reprints: ["set12-137"],
  cardType: "character",
  name: "Robin Hood",
  version: "Desert Wanderer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "012",
  cardNumber: 137,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_493b48e5adba46f1aeff1ddb9eaffd47",
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: robinHoodDesertWandererI18n,
};
