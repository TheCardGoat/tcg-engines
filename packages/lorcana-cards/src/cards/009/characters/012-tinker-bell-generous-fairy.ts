import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGenerousFairy: CharacterCard = {
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
      id: "e6y-1",
      name: "MAKE A NEW FRIEND",
      text: "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 12,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 4,
  externalIds: {
    ravensburger: "3327481e6f129bd0a97e63a5c7d2bff9190b7ffd",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Generous Fairy",
  id: "e6y",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Tinker Bell",
  set: "009",
  strength: 1,
  text: "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Generous Fairy",
  willpower: 4,
};
