import type { CharacterCard } from "@tcg/lorcana-types";
import { magicCarpetAmazingFlierI18n } from "./051-magic-carpet-amazing-flier.i18n";

export const magicCarpetAmazingFlier: CharacterCard = {
  id: "2JV",
  canonicalId: "ci_2JV",
  reprints: ["set6-051"],
  cardType: "character",
  name: "Magic Carpet",
  version: "Amazing Flier",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 51,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_00d0840f303c41b1868ce427b9aaf837",
    tcgPlayer: 592026,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: magicCarpetAmazingFlierI18n,
};
