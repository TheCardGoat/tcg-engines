import type { CharacterCard } from "@tcg/lorcana-types";
import { pumbaaFriendlyWarthogI18n } from "./017-pumbaa-friendly-warthog.i18n";

export const pumbaaFriendlyWarthog: CharacterCard = {
  id: "Itm",
  canonicalId: "ci_Itm",
  reprints: ["set1-017"],
  cardType: "character",
  name: "Pumbaa",
  version: "Friendly Warthog",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 17,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_389a5296a2114c10a16be57f0677429f",
    tcgPlayer: 508701,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: pumbaaFriendlyWarthogI18n,
};
