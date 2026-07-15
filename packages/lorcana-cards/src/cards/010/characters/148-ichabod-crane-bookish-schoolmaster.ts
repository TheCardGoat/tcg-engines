import type { CharacterCard } from "@tcg/lorcana-types";

export const ichabodCraneBookishSchoolmaster: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you've played a character with cost 5 or more this turn",
          type: "if",
        },
        then: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "hnb-1",
      name: "WELL-READ",
      text: "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 148,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "3f9a4fc0f61c93fc34e9d4be9a1e536b74cccb47",
  },
  franchise: "Sleepy Hollow",
  fullName: "Ichabod Crane - Bookish Schoolmaster",
  id: "hnb",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Ichabod Crane",
  set: "010",
  strength: 2,
  text: "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
  version: "Bookish Schoolmaster",
  willpower: 4,
};
