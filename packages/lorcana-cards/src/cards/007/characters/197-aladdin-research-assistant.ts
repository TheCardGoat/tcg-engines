import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinResearchAssistant: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 3,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "1do-1",
      name: "HELPING HAND",
      text: "HELPING HAND Whenever this character quests, you may play an Ally character with cost 3 or less for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1do-2",
      text: "PUT IN THE EFFORT While this character is exerted, your Ally characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 197,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "b3111adf9384908477e6d72898ce887404f74a0c",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Research Assistant",
  id: "1do",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Aladdin",
  set: "007",
  strength: 2,
  text: "HELPING HAND Whenever this character quests, you may play an Ally character with cost 3 or less for free.\nPUT IN THE EFFORT While this character is exerted, your Ally characters get +1 {S}.",
  version: "Research Assistant",
  willpower: 4,
};
