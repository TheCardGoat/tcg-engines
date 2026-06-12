import type { CharacterCard } from "@tcg/lorcana-types";
import { nakomaWaitingOutTheStormI18n } from "./006-nakoma-waiting-out-the-storm.i18n";

export const nakomaWaitingOutTheStorm: CharacterCard = {
  id: "FhP",
  canonicalId: "ci_FhP",
  reprints: ["set11-006"],
  cardType: "character",
  name: "Nakoma",
  version: "Waiting Out the Storm",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 6,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1bd5bf1817684e57a918f2fdc04b4e3a",
    tcgPlayer: 674319,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: nakomaWaitingOutTheStormI18n,
};
