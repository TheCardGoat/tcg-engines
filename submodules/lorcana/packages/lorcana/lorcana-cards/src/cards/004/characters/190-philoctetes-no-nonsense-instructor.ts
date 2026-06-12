import type { CharacterCard } from "@tcg/lorcana-types";
import { philoctetesNononsenseInstructorI18n } from "./190-philoctetes-no-nonsense-instructor.i18n";

export const philoctetesNononsenseInstructor: CharacterCard = {
  id: "Lpe",
  canonicalId: "ci_C1p",
  reprints: ["set4-190", "set9-171"],
  cardType: "character",
  name: "Philoctetes",
  version: "No-Nonsense Instructor",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 190,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f92eff31c1e24bb7802247c709840973",
    tcgPlayer: 650105,
  },
  text: [
    {
      title: "YOU GOTTA STAY FOCUSED",
      description: "Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)",
    },
    {
      title: "SHAMELESS PROMOTER",
      description: "Whenever you play a Hero character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        keyword: "Challenger",
        target: "YOUR_HERO_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      id: "1r4-1",
      name: "YOU GOTTA STAY FOCUSED",
      text: "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1.",
      type: "static",
    },
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      id: "1r4-2",
      name: "SHAMELESS PROMOTER",
      text: "SHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Hero",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: philoctetesNononsenseInstructorI18n,
};
