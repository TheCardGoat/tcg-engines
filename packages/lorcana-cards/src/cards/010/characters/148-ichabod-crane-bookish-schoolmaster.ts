import type { CharacterCard } from "@tcg/lorcana-types";

export const ichabodCraneBookishSchoolmaster: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've played a character with cost 5 or more this turn",
        },
        then: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
      id: "hnb-1",
      name: "WELL-READ",
      text: "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
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
