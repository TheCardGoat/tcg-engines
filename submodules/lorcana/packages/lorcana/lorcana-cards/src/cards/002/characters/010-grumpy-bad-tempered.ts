import type { CharacterCard } from "@tcg/lorcana-types";
import { grumpyBadtemperedI18n } from "./010-grumpy-bad-tempered.i18n";

export const grumpyBadtempered: CharacterCard = {
  id: "Xv5",
  canonicalId: "ci_Xv5",
  reprints: ["set2-010"],
  cardType: "character",
  name: "Grumpy",
  version: "Bad-Tempered",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 10,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9d62c487faa543c78f964ac8ff1a73f6",
    tcgPlayer: 526388,
  },
  text: [
    {
      title: "THERE'S TROUBLE A-BREWIN'",
      description: "Your other Seven Dwarfs characters get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS",
        type: "modify-stat",
      },
      id: "Xv5-1",
      name: "THERE'S TROUBLE A-BREWIN'",
      text: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: grumpyBadtemperedI18n,
};
