import type { CharacterCard } from "@tcg/lorcana-types";
import { antoniosJaguarFaithfulCompanionI18n } from "./031-antonios-jaguar-faithful-companion.i18n";

export const antoniosJaguarFaithfulCompanion: CharacterCard = {
  id: "tDk",
  canonicalId: "ci_tDk",
  reprints: ["set8-031"],
  cardType: "character",
  name: "Antonio's Jaguar",
  version: "Faithful Companion",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 31,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5aeba01760c3494cae9eb6629dfdb1de",
    tcgPlayer: 631344,
  },
  text: [
    {
      title: "YOU WANT TO GO WHERE?",
      description:
        "When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Antonio Madrigal",
        controller: "you",
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "c5s-1",
      name: "YOU WANT TO GO WHERE?",
      text: "YOU WANT TO GO WHERE? When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: antoniosJaguarFaithfulCompanionI18n,
};
