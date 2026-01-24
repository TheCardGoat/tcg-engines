import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGenerousFairy: CharacterCard = {
  id: "e6y",
  cardType: "character",
  name: "Tinker Bell",
  version: "Generous Fairy",
  fullName: "Tinker Bell - Generous Fairy",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "009",
  text: "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 12,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3327481e6f129bd0a97e63a5c7d2bff9190b7ffd",
  },
  abilities: [
    {
      id: "e6y-1",
      type: "triggered",
      name: "MAKE A NEW FRIEND",
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
      text: "MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
