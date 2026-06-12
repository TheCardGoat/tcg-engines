import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenHatefulRivalI18n } from "./057-the-queen-hateful-rival.i18n";

export const theQueenHatefulRival: CharacterCard = {
  id: "F4E",
  canonicalId: "ci_F4E",
  reprints: ["set3-057"],
  cardType: "character",
  name: "The Queen",
  version: "Hateful Rival",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "003",
  cardNumber: 57,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8af5e037a64f41e58380427a86148bb5",
    tcgPlayer: 539076,
  },
  classifications: ["Dreamborn", "Villain", "Queen", "Sorcerer"],
  i18n: theQueenHatefulRivalI18n,
};
