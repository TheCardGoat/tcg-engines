import type { CharacterCard } from "@tcg/lorcana-types";

export const goGoTomagoCuttingEdge: CharacterCard = {
  id: "1l3",
  cardType: "character",
  name: "Go Go Tomago",
  version: "Cutting Edge",
  fullName: "Go Go Tomago - Cutting Edge",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Go Go Tomago.)\nEvasive (Only characters with Evasive can challenge this character.)\nZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 107,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cdc3c66cf9a3541d7db1be9979f16c88c14c6113",
  },
  abilities: [
    {
      id: "1l3-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1l3-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1l3-3",
      type: "triggered",
      name: "ZERO RESISTANCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play her",
        },
        then: {
          type: "put-into-inkwell",
          source: "chosen-character",
          target: "OPPONENT",
          exerted: true,
          facedown: true,
        },
      },
      text: "ZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Inventor"],
};
