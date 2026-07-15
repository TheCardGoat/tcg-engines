import type { CharacterCard } from "@tcg/lorcana-types";

export const liloBestExplorerEver: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "127-1",
      text: "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn",
      type: "static",
    },
    {
      effect: {
        steps: [
          {
            keyword: "Challenger",
            target: "SELF",
            type: "gain-keyword",
            value: 2,
          },
          {
            ability: "can-challenge-ready",
            target: "SELF",
            type: "grant-ability",
          },
        ],
        type: "sequence",
      },
      id: "127-2",
      name: "GO GET 'EM",
      text: 'GO GET \'EM Whenever this character quests, chosen Alien character gains Challenger +2 and "This character can challenge ready characters" this turn.',
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 174,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "89a9cf3060e267f03223e97c6bd0ec7ab0072c80",
  },
  franchise: "Lilo and Stitch",
  fullName: "Lilo - Best Explorer Ever",
  id: "127",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Lilo",
  set: "009",
  strength: 2,
  text: "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn (They get +2 {S} while challenging.)\nGO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and \"This character can challenge ready characters\" this turn.",
  version: "Best Explorer Ever",
  willpower: 2,
};
