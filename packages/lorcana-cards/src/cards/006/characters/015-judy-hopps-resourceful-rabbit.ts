import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsResourcefulRabbit: CharacterCard = {
  id: "1r5",
  cardType: "character",
  name: "Judy Hopps",
  version: "Resourceful Rabbit",
  fullName: "Judy Hopps - Resourceful Rabbit",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "064fed608ce47eeb3e4ae4b15e6fc7f3e58763e1",
  },
  abilities: [
    {
      id: "1r5-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1r5-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "NEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
