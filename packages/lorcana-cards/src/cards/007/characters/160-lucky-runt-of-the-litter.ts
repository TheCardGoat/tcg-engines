import type { CharacterCard } from "@tcg/lorcana-types";

export const luckyRuntOfTheLitter: CharacterCard = {
  id: "1qo",
  cardType: "character",
  name: "Lucky",
  version: "Runt of the Litter",
  fullName: "Lucky - Runt of the Litter",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 160,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e1e514a227339f3c439243177d0de9e17bd71e57",
  },
  abilities: [
    {
      id: "1qo-1",
      type: "triggered",
      name: "FOLLOW MY VOICE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
};
