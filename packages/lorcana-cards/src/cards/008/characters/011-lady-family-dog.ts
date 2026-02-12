import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyFamilyDog: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 2,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "ri7-1",
      name: "SOMEONE TO CARE FOR",
      text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 11,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "6321f91ab33afe4ddca12636c0eb4a49d69bf917",
  },
  franchise: "Lady and the Tramp",
  fullName: "Lady - Family Dog",
  id: "ri7",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Lady",
  set: "008",
  strength: 2,
  text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
  version: "Family Dog",
  willpower: 2,
};
