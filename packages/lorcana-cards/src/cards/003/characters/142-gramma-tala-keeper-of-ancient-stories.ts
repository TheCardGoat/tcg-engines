import type { CharacterCard } from "@tcg/lorcana-types";

export const grammaTalaKeeperOfAncientStories: CharacterCard = {
  id: "1ga",
  cardType: "character",
  name: "Gramma Tala",
  version: "Keeper of Ancient Stories",
  fullName: "Gramma Tala - Keeper of Ancient Stories",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  text: "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 142,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bc6fd7ac911a2a70ed405fd12118d2c4d90ec0df",
  },
  abilities: [
    {
      id: "1ga-1",
      type: "triggered",
      name: "THERE WAS ONLY OCEAN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
