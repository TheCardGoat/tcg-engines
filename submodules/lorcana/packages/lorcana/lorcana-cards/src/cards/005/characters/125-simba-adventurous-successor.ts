import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaAdventurousSuccessorI18n } from "./125-simba-adventurous-successor.i18n";

export const simbaAdventurousSuccessor: CharacterCard = {
  id: "QVE",
  canonicalId: "ci_QVE",
  reprints: ["set5-125"],
  cardType: "character",
  name: "Simba",
  version: "Adventurous Successor",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 125,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_655a6cb32b86442e8bfc1538371dcded",
    tcgPlayer: 560135,
  },
  text: [
    {
      title: "I LAUGH IN THE FACE OF DANGER",
      description: "When you play this character, chosen character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1vb-1",
      name: "I LAUGH IN THE FACE OF DANGER",
      text: "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: simbaAdventurousSuccessorI18n,
};
