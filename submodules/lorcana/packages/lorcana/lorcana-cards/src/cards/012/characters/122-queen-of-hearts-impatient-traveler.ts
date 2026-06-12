import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsImpatientTravelerI18n } from "./122-queen-of-hearts-impatient-traveler.i18n";

export const queenOfHeartsImpatientTraveler: CharacterCard = {
  id: "kE0",
  canonicalId: "ci_kE0",
  reprints: ["set12-122"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Impatient Traveler",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "012",
  cardNumber: 122,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d0e471f08f1e48f9ac4103827e910ce4",
  },
  text: [
    {
      title: "ROYAL COMMAND",
      description:
        "Whenever this character quests, if you played another character this turn, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Queen"],
  abilities: [
    {
      id: "W1l-1",
      name: "ROYAL COMMAND",
      type: "triggered",
      text: "ROYAL COMMAND Whenever this character quests, if you played another character this turn, chosen character gains Rush this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        excludeSource: true,
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  i18n: queenOfHeartsImpatientTravelerI18n,
};
