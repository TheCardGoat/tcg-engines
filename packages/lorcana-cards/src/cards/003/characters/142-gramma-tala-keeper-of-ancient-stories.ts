import type { CharacterCard } from "@tcg/lorcana-types";

export const grammaTalaKeeperOfAncientStories: CharacterCard = {
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
      id: "1ga-1",
      name: "THERE WAS ONLY OCEAN",
      text: "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 4,
  externalIds: {
    ravensburger: "bc6fd7ac911a2a70ed405fd12118d2c4d90ec0df",
  },
  franchise: "Moana",
  fullName: "Gramma Tala - Keeper of Ancient Stories",
  id: "1ga",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gramma Tala",
  set: "003",
  strength: 3,
  text: "THERE WAS ONLY OCEAN When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Keeper of Ancient Stories",
  willpower: 3,
};
