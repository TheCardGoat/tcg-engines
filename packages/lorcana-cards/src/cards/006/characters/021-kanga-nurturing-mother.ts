import type { CharacterCard } from "@tcg/lorcana-types";

export const kangaNurturingMother: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      id: "qu5-1",
      name: "SAFE AND SOUND",
      text: "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "60b997fd5e49d37c9accc8253365dcc6f385e43a",
  },
  franchise: "Winnie the Pooh",
  fullName: "Kanga - Nurturing Mother",
  id: "qu5",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Kanga",
  set: "006",
  strength: 2,
  text: "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
  version: "Nurturing Mother",
  willpower: 4,
};
