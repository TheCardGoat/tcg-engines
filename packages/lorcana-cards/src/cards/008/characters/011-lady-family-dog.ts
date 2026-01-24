import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyFamilyDog: CharacterCard = {
  id: "ri7",
  cardType: "character",
  name: "Lady",
  version: "Family Dog",
  fullName: "Lady - Family Dog",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "008",
  text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 11,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6321f91ab33afe4ddca12636c0eb4a49d69bf917",
  },
  abilities: [
    {
      id: "ri7-1",
      type: "triggered",
      name: "SOMEONE TO CARE FOR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 2,
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
