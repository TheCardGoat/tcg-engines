import type { CharacterCard } from "@tcg/lorcana-types";
import { arielCuriousTravelerI18n } from "./018-ariel-curious-traveler.i18n";

export const arielCuriousTraveler: CharacterCard = {
  id: "BW6",
  canonicalId: "ci_BW6",
  reprints: ["set12-018"],
  cardType: "character",
  name: "Ariel",
  version: "Curious Traveler",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "012",
  cardNumber: 18,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1a1e041109e6448c889803fb5be588d9",
  },
  text: [
    {
      title: "FAMILIAR GROUND",
      description:
        "Whenever this character quests, if you played another character this turn, chosen opposing character can't challenge and must quest during their next turn if able.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "BW6-1",
      name: "FAMILIAR GROUND",
      type: "triggered",
      text: "FAMILIAR GROUND Whenever this character quests, if you played another character this turn, chosen opposing character can't challenge and must quest during their next turn if able.",
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
        type: "sequence",
        steps: [
          {
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "their-next-turn",
            type: "restriction",
          },
          {
            restriction: "must-quest",
            target: {
              ref: "previous-target",
            },
            duration: "their-next-turn",
            type: "restriction",
          },
        ],
      },
    },
  ],
  i18n: arielCuriousTravelerI18n,
};
