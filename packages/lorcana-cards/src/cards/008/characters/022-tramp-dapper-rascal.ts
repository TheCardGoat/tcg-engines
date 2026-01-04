import type { CharacterCard } from "@tcg/lorcana-types";

export const trampDapperRascal: CharacterCard = {
  id: "1x4",
  cardType: "character",
  name: "Tramp",
  version: "Dapper Rascal",
  fullName: "Tramp - Dapper Rascal",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)\nPLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.",
  cost: 6,
  strength: 2,
  willpower: 8,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  externalIds: {
    ravensburger: "f9251288543cab07d29ed94183d3801f55983056",
  },
  abilities: [
    {
      id: "1x4-1",
      text: "Shift",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    },
    {
      id: "1x4-2",
      name: "PLAY IT COOL",
      text: "PLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "turn",
          whose: "opponent",
        },
        then: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          chooser: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
