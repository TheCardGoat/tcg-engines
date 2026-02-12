import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogsFollowersCreaturesOfEvil: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "nd2-1",
      name: "RESTLESS SOULS",
      text: "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "543369c0676bd8eef7719a7222f19cca6fe00083",
  },
  franchise: "Fantasia",
  fullName: "Chernabog's Followers - Creatures of Evil",
  id: "nd2",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Chernabog's Followers",
  set: "003",
  strength: 2,
  text: "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.",
  version: "Creatures of Evil",
  willpower: 1,
};
