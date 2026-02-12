import type { CharacterCard } from "@tcg/lorcana-types";

export const trampDapperRascal: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1x4-1",
      keyword: "Shift",
      text: "Shift 4",
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
      id: "1x4-2",
      text: "PLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "f9251288543cab07d29ed94183d3801f55983056",
  },
  franchise: "Lady and the Tramp",
  fullName: "Tramp - Dapper Rascal",
  id: "1x4",
  inkType: ["amber", "emerald"],
  inkable: true,
  lore: 2,
  name: "Tramp",
  set: "008",
  strength: 2,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)\nPLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.",
  version: "Dapper Rascal",
  willpower: 8,
};
