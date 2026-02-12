import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxPersonalHealthcareCompanion: CharacterCard = {
  abilities: [
    {
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
      id: "1p5-1",
      text: "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
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
      id: "1p5-2",
      text: "YOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.",
      type: "action",
    },
  ],
  cardNumber: 156,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Robot"],
  cost: 3,
  externalIds: {
    ravensburger: "dcbcc092217bb31b8bc790a740f918c336552b29",
  },
  franchise: "Big Hero 6",
  fullName: "Baymax - Personal Healthcare Companion",
  id: "1p5",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Baymax",
  set: "006",
  strength: 0,
  text: "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.\nYOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.",
  version: "Personal Healthcare Companion",
  willpower: 4,
};
