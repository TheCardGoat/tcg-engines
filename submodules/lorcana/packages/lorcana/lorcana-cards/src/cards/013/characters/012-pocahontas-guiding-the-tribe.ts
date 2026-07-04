import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasGuidingTheTribeI18n } from "./012-pocahontas-guiding-the-tribe.i18n";

export const pocahontasGuidingTheTribe: CharacterCard = {
  id: "8Ki",
  canonicalId: "ci_4vv",
  slug: "lorcana-ci_4vv",
  printings: [
    {
      id: "set13-012",
      artId: "set13-012",
      setCode: "set13",
      collectorNumber: "12",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-012"],
  cardType: "character",
  name: "Pocahontas",
  version: "Guiding the Tribe",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 12,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Stay Close",
      description: "When you play this character, you may play a character with cost 1 for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      type: "triggered",
      name: "Stay Close",
      text: "Stay Close When you play this character, you may play a character with cost 1 for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "character",
          costRestriction: {
            comparison: "equal",
            value: 1,
          },
          cost: "free",
        },
      },
    },
  ],
  i18n: pocahontasGuidingTheTribeI18n,
};
