import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxPersonalHealthcareCompanion: CharacterCard = {
  id: "1p5",
  cardType: "character",
  name: "Baymax",
  version: "Personal Healthcare Companion",
  fullName: "Baymax - Personal Healthcare Companion",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.\nYOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 156,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dcbcc092217bb31b8bc790a740f918c336552b29",
  },
  abilities: [
    {
      id: "1p5-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have an Inventor character in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.",
    },
    {
      id: "1p5-2",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 1,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "YOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
};
