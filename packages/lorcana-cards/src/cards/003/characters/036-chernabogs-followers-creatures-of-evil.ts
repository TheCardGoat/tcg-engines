import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogsFollowersCreaturesOfEvil: CharacterCard = {
  id: "nd2",
  cardType: "character",
  name: "Chernabog's Followers",
  version: "Creatures of Evil",
  fullName: "Chernabog's Followers - Creatures of Evil",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  text: "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "543369c0676bd8eef7719a7222f19cca6fe00083",
  },
  abilities: [
    {
      id: "nd2-1",
      type: "triggered",
      name: "RESTLESS SOULS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
