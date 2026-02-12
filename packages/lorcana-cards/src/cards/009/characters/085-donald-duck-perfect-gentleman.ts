import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckPerfectGentleman: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "wjj-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      id: "wjj-2",
      text: "ALLOW ME At the start of your turn, each player may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 85,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "754975b423fd73f951d33d2a0b695136a1c5e3b8",
  },
  fullName: "Donald Duck - Perfect Gentleman",
  id: "wjj",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Donald Duck",
  set: "009",
  strength: 2,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Donald Duck.)\nALLOW ME At the start of your turn, each player may draw a card.",
  version: "Perfect Gentleman",
  willpower: 5,
};
