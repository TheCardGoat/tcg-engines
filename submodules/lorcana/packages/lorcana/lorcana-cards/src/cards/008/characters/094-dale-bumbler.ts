import type { CharacterCard } from "@tcg/lorcana-types";
import { daleBumblerI18n } from "./094-dale-bumbler.i18n";

export const daleBumbler: CharacterCard = {
  id: "WWj",
  canonicalId: "ci_WWj",
  reprints: ["set8-094"],
  cardType: "character",
  name: "Dale",
  version: "Bumbler",
  inkType: ["emerald"],
  franchise: "Rescue Rangers",
  set: "008",
  cardNumber: 94,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bfb723663a9d477c92b6b0322d7a578d",
    tcgPlayer: 631347,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: daleBumblerI18n,
};
