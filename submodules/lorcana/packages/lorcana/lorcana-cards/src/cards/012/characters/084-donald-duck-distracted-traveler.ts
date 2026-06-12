import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckDistractedTravelerI18n } from "./084-donald-duck-distracted-traveler.i18n";

export const donaldDuckDistractedTraveler: CharacterCard = {
  id: "QXV",
  canonicalId: "ci_QXV",
  reprints: ["set12-084"],
  cardType: "character",
  name: "Donald Duck",
  version: "Distracted Traveler",
  inkType: ["emerald"],
  set: "012",
  cardNumber: 84,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8ca111f27f65418b8cc535a74f90d921",
  },
  text: [
    {
      title: "BURNING CURIOSITY",
      description:
        "Whenever this character quests, if you played another character this turn, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "QXV-1",
      name: "BURNING CURIOSITY",
      type: "triggered",
      text: "BURNING CURIOSITY Whenever this character quests, if you played another character this turn, each opponent chooses and discards a card.",
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
        type: "discard",
        amount: 1,
        chosen: true,
        from: "hand",
        target: "EACH_OPPONENT",
      },
    },
  ],
  i18n: donaldDuckDistractedTravelerI18n,
};
