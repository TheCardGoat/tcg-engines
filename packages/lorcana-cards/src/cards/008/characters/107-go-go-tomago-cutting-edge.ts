import type { CharacterCard } from "@tcg/lorcana-types";

export const goGoTomagoCuttingEdge: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1l3-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      id: "1l3-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you used Shift to play her",
          type: "if",
        },
        then: {
          exerted: true,
          facedown: true,
          source: "chosen-character",
          target: "OPPONENT",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "1l3-3",
      name: "ZERO RESISTANCE",
      text: "ZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "cdc3c66cf9a3541d7db1be9979f16c88c14c6113",
  },
  franchise: "Big Hero 6",
  fullName: "Go Go Tomago - Cutting Edge",
  id: "1l3",
  inkType: ["emerald", "sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Go Go Tomago",
  set: "008",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Go Go Tomago.)\nEvasive (Only characters with Evasive can challenge this character.)\nZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
  version: "Cutting Edge",
  willpower: 3,
};
