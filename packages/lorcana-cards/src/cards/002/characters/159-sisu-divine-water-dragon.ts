import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuDivineWaterDragon: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "rwp-1",
      name: "I TRUST YOU",
      text: "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  cost: 4,
  externalIds: {
    ravensburger: "64954a34ae8d8884b8fb5dd92473c229df33a39a",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Sisu - Divine Water Dragon",
  id: "rwp",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Sisu",
  set: "002",
  strength: 2,
  text: "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Divine Water Dragon",
  willpower: 4,
};
