import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenPennilessRoyalI18n } from "./191-prince-naveen-penniless-royal.i18n";

export const princeNaveenPennilessRoyal: CharacterCard = {
  id: "A9R",
  canonicalId: "ci_DSe",
  reprints: ["set2-191", "set9-182"],
  cardType: "character",
  name: "Prince Naveen",
  version: "Penniless Royal",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 191,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6bfaedf8350c4f27ad9c60c2ecb2c942",
    tcgPlayer: 650115,
  },
  classifications: ["Storyborn", "Prince"],
  i18n: princeNaveenPennilessRoyalI18n,
};
