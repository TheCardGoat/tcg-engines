import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaGuardianOfThePathI18n } from "./144-kida-guardian-of-the-path.i18n";

export const kidaGuardianOfThePath: CharacterCard = {
  id: "ucq",
  canonicalId: "ci_ucq",
  reprints: ["set12-144"],
  cardType: "character",
  name: "Kida",
  version: "Guardian of the Path",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 144,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_36826a0cb54b4f06b8e5de879e20d926",
  },
  text: [
    {
      title: "NATURAL DEFENSE",
      description: "When you play this character, chosen opposing character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "ucq-1",
      name: "Natural Defense",
      text: "Natural Defense When you play this character, chosen opposing character gets -2 {S} this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  i18n: kidaGuardianOfThePathI18n,
};
