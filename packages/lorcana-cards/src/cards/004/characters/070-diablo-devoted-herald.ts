import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloDevotedHerald: CharacterCard = {
  id: "1g3",
  cardType: "character",
  name: "Diablo",
  version: "Devoted Herald",
  fullName: "Diablo - Devoted Herald",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Shift: Discard an action card (You may discard an action card to play this on top of one of your characters named Diablo.)\nEvasive (Only characters with Evasive can challenge this character.)\nCIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 70,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd36724ac6baa50386ab4443e026f5d0e787b2cf",
  },
  abilities: [
    {
      id: "1g3-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1g3-3",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "CIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
