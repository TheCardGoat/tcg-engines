import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenMirrorSeeker: CharacterCard = {
  id: "fah",
  cardType: "character",
  name: "The Queen",
  version: "Mirror Seeker",
  fullName: "The Queen - Mirror Seeker",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "009",
  text: "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 149,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "371c9acb79a2f91a8f8547ba6113431120735ea8",
  },
  abilities: [
    {
      id: "fah-1",
      type: "triggered",
      name: "CALCULATING AND VAIN",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "scry",
          amount: 3,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "deck-top",
              remainder: true,
              ordering: "player-choice",
            },
          ],
        },
        chooser: "CONTROLLER",
      },
      text: "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};
