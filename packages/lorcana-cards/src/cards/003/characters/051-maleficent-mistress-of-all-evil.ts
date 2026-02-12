import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentMistressOfAllEvil: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "277-1",
      name: "DARK KNOWLEDGE",
      text: "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "07edd0c48b6c74df55bfa81bd0511d9b8743d8a1",
  },
  franchise: "Sleeping Beauty",
  fullName: "Maleficent - Mistress of All Evil",
  id: "277",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Maleficent",
  set: "003",
  strength: 2,
  text: "DARK KNOWLEDGE Whenever this character quests, you may draw a card DIVINATION During your turn, whenever you draw a card, you may move 1 damage counter from chosen character to chosen opposing character.",
  version: "Mistress of All Evil",
  willpower: 3,
};
