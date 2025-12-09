import type { CharacterCard } from "@tcg/lorcana";

export const kingCandySweetAbomination: CharacterCard = {
  id: "q61",
  cardType: "character",
  name: "King Candy",
  version: "Sweet Abomination",
  fullName: "King Candy - Sweet Abomination",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named King Candy.)\nCHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 154,
  inkable: false,
  externalIds: {
    ravensburger: "5e50dc86485330fa31a424a5ef8789c56472efd4",
  },
  abilities: [
    {
      id: "q61-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "q61-2",
      text: "CHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
      name: "CHANGING THE CODE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Racer"],
};
