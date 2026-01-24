import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinResearchAssistant: CharacterCard = {
  id: "1do",
  cardType: "character",
  name: "Aladdin",
  version: "Research Assistant",
  fullName: "Aladdin - Research Assistant",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "007",
  text: "HELPING HAND Whenever this character quests, you may play an Ally character with cost 3 or less for free.\nPUT IN THE EFFORT While this character is exerted, your Ally characters get +1 {S}.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 197,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b3111adf9384908477e6d72898ce887404f74a0c",
  },
  abilities: [
    {
      id: "1do-1",
      type: "triggered",
      name: "HELPING HAND",
      trigger: {
        event: "quest",
        timing: "whenever",
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
            value: 3,
          },
        },
        chooser: "CONTROLLER",
      },
      text: "HELPING HAND Whenever this character quests, you may play an Ally character with cost 3 or less for free.",
    },
    {
      id: "1do-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "PUT IN THE EFFORT While this character is exerted, your Ally characters get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
