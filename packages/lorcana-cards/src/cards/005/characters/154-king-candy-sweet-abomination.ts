import type { CharacterCard } from "@tcg/lorcana-types";

export const kingCandySweetAbomination: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "q61-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "q61-2",
      name: "CHANGING THE CODE",
      text: "CHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "King", "Racer"],
  cost: 5,
  externalIds: {
    ravensburger: "5e50dc86485330fa31a424a5ef8789c56472efd4",
  },
  franchise: "Wreck It Ralph",
  fullName: "King Candy - Sweet Abomination",
  id: "q61",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "King Candy",
  set: "005",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named King Candy.)\nCHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
  version: "Sweet Abomination",
  willpower: 3,
};
