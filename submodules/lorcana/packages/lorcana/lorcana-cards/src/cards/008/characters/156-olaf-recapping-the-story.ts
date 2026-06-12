import type { CharacterCard } from "@tcg/lorcana-types";
import { olafRecappingTheStoryI18n } from "./156-olaf-recapping-the-story.i18n";

export const olafRecappingTheStory: CharacterCard = {
  id: "obo",
  canonicalId: "ci_obo",
  reprints: ["set8-156"],
  cardType: "character",
  name: "Olaf",
  version: "Recapping the Story",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 156,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_af73ab0ecfb241e08c2ab10bc74ea708",
    tcgPlayer: 631454,
  },
  text: [
    {
      title: "ENDLESS TALE",
      description: "When you play this character, chosen opposing character gets -1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "fgl-1",
      name: "ENDLESS TALE",
      text: "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: olafRecappingTheStoryI18n,
};
