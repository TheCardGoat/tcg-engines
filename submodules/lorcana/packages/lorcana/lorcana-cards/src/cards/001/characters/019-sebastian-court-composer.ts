import type { CharacterCard } from "@tcg/lorcana-types";
import { sebastianCourtComposerI18n } from "./019-sebastian-court-composer.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const sebastianCourtComposer: CharacterCard = {
  id: "Xb7",
  canonicalId: "ci_Xb7",
  reprints: ["set1-019"],
  cardType: "character",
  name: "Sebastian",
  version: "Court Composer",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 19,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_acaae5dbf3c341b8ad35851ac755cfd6",
    tcgPlayer: 504540,
  },
  text: "Singer 4",
  classifications: ["Storyborn", "Ally"],
  abilities: [singer(4)],
  i18n: sebastianCourtComposerI18n,
};
