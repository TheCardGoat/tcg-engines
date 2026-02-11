import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsResourcefulRabbit: CharacterCard = {
  abilities: [
    {
      id: "1r5-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
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
      id: "1r5-2",
      text: "NEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
      type: "action",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "064fed608ce47eeb3e4ae4b15e6fc7f3e58763e1",
  },
  franchise: "Zootropolis",
  fullName: "Judy Hopps - Resourceful Rabbit",
  id: "1r5",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Judy Hopps",
  set: "006",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
  version: "Resourceful Rabbit",
  willpower: 6,
};
