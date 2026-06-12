import type { CharacterCard } from "@tcg/lorcana-types";
import { annaBravingTheStormI18n } from "./137-anna-braving-the-storm.i18n";

export const annaBravingTheStorm: CharacterCard = {
  id: "ISN",
  canonicalId: "ci_fSd",
  reprints: ["set4-137", "set9-146"],
  cardType: "character",
  name: "Anna",
  version: "Braving the Storm",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 137,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d911158c4175449e9814484f3c5adb06",
    tcgPlayer: 650153,
  },
  text: [
    {
      title: "I WAS BORN READY",
      description: "If you have another Hero character in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      condition: {
        type: "has-character-count",
        classification: "Hero",
        controller: "you",
        count: 2,
        comparison: "greater-or-equal",
      },
      id: "mi9-1",
      name: "I WAS BORN READY",
      text: "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.",
    },
  ],
  i18n: annaBravingTheStormI18n,
};
