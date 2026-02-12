import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckDonaldsDate: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "it's a character card",
          type: "if",
        },
        then: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "conditional",
      },
      id: "czn-1",
      name: "BIG PRIZE",
      text: "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "2ed178001e5757cae12c87f032cde03a7dc7948f",
  },
  fullName: "Daisy Duck - Donald's Date",
  id: "czn",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Daisy Duck",
  set: "005",
  strength: 1,
  text: "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
  version: "Donald's Date",
  willpower: 4,
};
