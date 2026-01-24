import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsUncoveringClues: CharacterCard = {
  id: "1mf",
  cardType: "character",
  name: "Judy Hopps",
  version: "Uncovering Clues",
  fullName: "Judy Hopps - Uncovering Clues",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2903ad2de30eb97d60047da81f4ec15b1bcbb13",
  },
  abilities: [
    {
      id: "1mf-1",
      type: "triggered",
      name: "THOROUGH INVESTIGATION When you play this character and",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
};
