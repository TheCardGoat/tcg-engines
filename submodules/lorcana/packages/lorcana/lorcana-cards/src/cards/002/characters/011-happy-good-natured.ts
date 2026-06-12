import type { CharacterCard } from "@tcg/lorcana-types";
import { happyGoodnaturedI18n } from "./011-happy-good-natured.i18n";

export const happyGoodnatured: CharacterCard = {
  id: "Rek",
  canonicalId: "ci_Rek",
  reprints: ["set2-011"],
  cardType: "character",
  name: "Happy",
  version: "Good-Natured",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 11,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7bea75aa713d410a9be82d9e82ace333",
    tcgPlayer: 526383,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      id: "det-1",
      keyword: "Support",
      type: "keyword",
      text: "Support",
    },
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
        classification: "Seven Dwarfs",
        controller: "you",
        count: 2,
        comparison: "greater-or-equal",
      },
      id: "dig-1",
      name: "DIG, DIG, DIG",
      text: "DIG, DIG, DIG While you have another Seven Dwarfs character in play, this character gets +1 {L}.",
    },
  ],
  i18n: happyGoodnaturedI18n,
};
