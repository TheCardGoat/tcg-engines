import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaGuardianOfThePathEpicI18n } from "./217-kida-guardian-of-the-path-epic.i18n";

export const kidaGuardianOfThePathEpic: CharacterCard = {
  id: "APM",
  canonicalId: "ci_ucq",
  slug: "lorcana-ci_ucq",
  printings: [
    {
      id: "set12-217-epic",
      artId: "ci_ucq-epic",
      setCode: "set12",
      collectorNumber: "217",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-144"],
  cardType: "character",
  name: "Kida",
  version: "Guardian of the Path",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 217,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4f772bcbcd244314a99264fb106166dd",
    tcgPlayer: "692212",
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
  i18n: kidaGuardianOfThePathEpicI18n,
};
