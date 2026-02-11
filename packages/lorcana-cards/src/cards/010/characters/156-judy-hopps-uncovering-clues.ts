import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsUncoveringClues: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "1mf-1",
      name: "THOROUGH INVESTIGATION When you play this character and",
      text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 156,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Detective"],
  cost: 4,
  externalIds: {
    ravensburger: "d2903ad2de30eb97d60047da81f4ec15b1bcbb13",
  },
  franchise: "Zootropolis",
  fullName: "Judy Hopps - Uncovering Clues",
  id: "1mf",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Judy Hopps",
  set: "010",
  strength: 3,
  text: "THOROUGH INVESTIGATION When you play this character and whenever she quests, look at the top 3 cards of your deck. You may reveal a Detective character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Uncovering Clues",
  willpower: 3,
};
