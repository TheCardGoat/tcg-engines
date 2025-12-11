import type { CharacterCard } from "@tcg/lorcana";

export const maleficentMistressOfAllEvil: CharacterCard = {
  id: "277",
  cardType: "character",
  name: "Maleficent",
  version: "Mistress of All Evil",
  fullName: "Maleficent - Mistress of All Evil",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "003",
  text: "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
  cost: 5,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  externalIds: {
    ravensburger: "07edd0c48b6c74df55bfa81bd0511d9b8743d8a1",
  },
  abilities: [
    {
      id: "277-1",
      text: "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
      name: "DARK KNOWLEDGE",
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
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
