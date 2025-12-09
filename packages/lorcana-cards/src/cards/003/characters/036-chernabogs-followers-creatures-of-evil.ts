import type { CharacterCard } from "@tcg/lorcana";

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
  externalIds: {
    ravensburger: "543369c0676bd8eef7719a7222f19cca6fe00083",
  },
  abilities: [
    {
      id: "nd2-1",
      text: "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.",
      name: "RESTLESS SOULS",
      type: "triggered",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
