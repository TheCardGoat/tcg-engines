import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineDisguisedI18n } from "./148-jasmine-disguised.i18n";

export const jasmineDisguised: CharacterCard = {
  id: "crg",
  canonicalId: "ci_crg",
  reprints: ["set1-148"],
  cardType: "character",
  name: "Jasmine",
  version: "Disguised",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 148,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c401f199cd7046b4838589db368f2391",
    tcgPlayer: 508851,
  },
  classifications: ["Storyborn", "Princess"],
  i18n: jasmineDisguisedI18n,
};
