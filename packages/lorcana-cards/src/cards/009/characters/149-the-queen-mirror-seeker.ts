import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenMirrorSeeker: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          destinations: [
            {
              zone: "deck-top",
              remainder: true,
              ordering: "player-choice",
            },
          ],
          target: "CONTROLLER",
          type: "scry",
        },
        type: "optional",
      },
      id: "fah-1",
      name: "CALCULATING AND VAIN",
      text: "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 149,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "371c9acb79a2f91a8f8547ba6113431120735ea8",
  },
  franchise: "Snow White",
  fullName: "The Queen - Mirror Seeker",
  id: "fah",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Queen",
  set: "009",
  strength: 2,
  text: "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.",
  version: "Mirror Seeker",
  willpower: 5,
};
