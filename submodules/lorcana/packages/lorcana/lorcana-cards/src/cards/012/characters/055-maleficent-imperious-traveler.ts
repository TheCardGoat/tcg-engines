import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentImperiousTravelerI18n } from "./055-maleficent-imperious-traveler.i18n";

export const maleficentImperiousTraveler: CharacterCard = {
  id: "pn3",
  canonicalId: "ci_pn3",
  reprints: ["set12-055"],
  cardType: "character",
  name: "Maleficent",
  version: "Imperious Traveler",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "012",
  cardNumber: 55,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_586e5a2d7baa4cefb96e5f65a68e0cc2",
  },
  text: [
    {
      title: "HEED MY WORDS",
      description:
        "Whenever this character quests, if you played another character this turn, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "QsI-1",
      name: "HEED MY WORDS",
      type: "triggered",
      text: "HEED MY WORDS Whenever this character quests, if you played another character this turn, you may exert chosen opposing character.",
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
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: maleficentImperiousTravelerI18n,
};
