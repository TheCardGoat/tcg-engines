import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloDevotedHerald: CharacterCard = {
  abilities: [
    {
      id: "1g3-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1g3-3",
      text: "CIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "bd36724ac6baa50386ab4443e026f5d0e787b2cf",
  },
  franchise: "Sleeping Beauty",
  fullName: "Diablo - Devoted Herald",
  id: "1g3",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Diablo",
  set: "004",
  strength: 2,
  text: "Shift: Discard an action card (You may discard an action card to play this on top of one of your characters named Diablo.)\nEvasive (Only characters with Evasive can challenge this character.)\nCIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
  version: "Devoted Herald",
  willpower: 2,
};
