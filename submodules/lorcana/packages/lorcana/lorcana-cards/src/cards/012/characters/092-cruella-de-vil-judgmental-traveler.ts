import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilJudgmentalTravelerI18n } from "./092-cruella-de-vil-judgmental-traveler.i18n";

export const cruellaDeVilJudgmentalTraveler: CharacterCard = {
  id: "fQT",
  canonicalId: "ci_fQT",
  reprints: ["set12-092"],
  cardType: "character",
  name: "Cruella De Vil",
  version: "Judgmental Traveler",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "012",
  cardNumber: 92,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_f8c2be32fbd44519b24aba773718210a",
  },
  text: [
    {
      title: "YOU'RE OUT OF FASHION",
      description:
        "Whenever this character quests, if you played another character this turn, you may banish chosen damaged character.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      id: "mf4-1",
      name: "YOU'RE OUT OF FASHION",
      type: "triggered",
      text: "YOU'RE OUT OF FASHION Whenever this character quests, if you played another character this turn, you may banish chosen damaged character.",
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
          type: "banish",
          target: "CHOSEN_DAMAGED_CHARACTER",
        },
      },
    },
  ],
  i18n: cruellaDeVilJudgmentalTravelerI18n,
};
