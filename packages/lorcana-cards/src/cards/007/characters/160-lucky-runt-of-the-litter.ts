import type { CharacterCard } from "@tcg/lorcana-types";

export const luckyRuntOfTheLitter: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "1qo-1",
      name: "FOLLOW MY VOICE",
      text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 160,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 3,
  externalIds: {
    ravensburger: "e1e514a227339f3c439243177d0de9e17bd71e57",
  },
  franchise: "101 Dalmatians",
  fullName: "Lucky - Runt of the Litter",
  id: "1qo",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Lucky",
  set: "007",
  strength: 1,
  text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
  version: "Runt of the Litter",
  willpower: 3,
};
